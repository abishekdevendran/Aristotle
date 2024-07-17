<script lang="ts">
	export let data;
	import ConnectionStatus from '$lib/components/ConnectionStatus.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getUser } from '$lib/stores/index.js';
	import { GetSocket } from '$lib/stores/socket.js';
	import type { Player } from '$lib/types.js';
	import { toast } from 'svelte-sonner';
	import { flip } from 'svelte/animate';
	import { dndzone, dragHandle, dragHandleZone, type DndEvent } from 'svelte-dnd-action';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	const flipDurationMs = 300;
	let messages: {
		message: string;
		id?: string;
	}[] = [];
	let players: Player[] = [];
	let playerOrder: string[] = [];
	const dummyPlayerOrder = ['js67vkjw6uuwbrhf', '6glnfaulseiohnqd'];
	$: dndObject = playerOrder.map((e) => ({
		id: e,
		name: players.find((el) => el.id === e)?.name ?? 'Unknown'
	}));
	$: console.log(dndObject);
	const user = getUser();
	const socket = GetSocket();
	let hasEventListenerAdded = false;
	$: $user = data.user;
	$: $socket = data.socket;
	$: {
		if ($socket && !hasEventListenerAdded) {
			$socket.addEventListener('message', (message) => {
				const msg = JSON.parse(message.data) as
					| {
							type: 'POPULATE';
							data: {
								players: Player[];
								playerOrder: string[];
								messages: { id: string; message: string }[];
							};
					  }
					| {
							type: 'MESSAGE';
							data: { id: string; message: string };
					  }
					| { type: 'JOIN' | 'LEAVE'; data: { message: string; player: Player } }
					| { type: 'REORDER'; data: { playerOrder: string[] } };
				console.log(msg);
				if (msg.type === 'POPULATE') {
					toast.success('Data populated successfully');
					players = msg.data.players;
					playerOrder = msg.data.playerOrder;
					messages = msg.data.messages;
				} else if (msg.type === 'MESSAGE') {
					console.log(msg.data);
					messages = [...messages, msg.data];
				} else if (msg.type === 'JOIN' || msg.type === 'LEAVE') {
					toast(msg.data.message);
					if (msg.type === 'JOIN') {
						// if player doesnt already exist, add it
						if (!players.find((el) => el.id === msg.data.player.id)) {
							players = [...players, msg.data.player];
						}
						playerOrder = [...playerOrder, msg.data.player.id];
					} else {
						playerOrder = playerOrder.filter((el) => el !== msg.data.player.id);
					}
				} else if (msg.type === 'REORDER') {
					playerOrder = msg.data.playerOrder;
				}
			});
			hasEventListenerAdded = true;
		}
	}
	let textInput = '';
	function handleDndConsider(
		e: CustomEvent<
			DndEvent<{
				id: string;
				name: string;
			}>
		>
	) {
		const { items } = e.detail;
		console.log('consider', items);
		dndObject = items;
	}
	function handleDndFinalize(
		e: CustomEvent<
			DndEvent<{
				id: string;
				name: string;
			}>
		>
	) {
		const { items } = e.detail;
		console.log('finalize', items);
		dndObject = items;
		$socket?.send(
			JSON.stringify({
				type: 'REORDER',
				data: { playerOrder: items.map((el) => el.id) }
			})
		);
	}
</script>

<svelte:head>
	<title>{data.game.name} | {data.roomId} | Aristotle</title>
</svelte:head>
<div class="container flex-col flex items-center justify-center gap-2">
{#if $socket}
	<ConnectionStatus socket={$socket} />
	<form
		on:submit|preventDefault={() => {
			messages = [...messages, { id: $user.id ?? 'Unknown', message: textInput }];
			console.log(messages);
			$socket.send(
				JSON.stringify({
					type: 'MESSAGE',
					data: { message: textInput }
				})
			);
			textInput = '';
		}}
		class="flex gap-2"
	>
		<Input type="text" bind:value={textInput} placeholder="Hello Everynyan!" />
		<Button type="submit">Send</Button>
	</form>
{/if}
<div class="flex max-h-96 flex-col overflow-x-hidden overflow-y-auto w-full">
	{#if messages.length > 0}
		{#each messages as message}
			<p>
				{message.id
					? message.id === $user.id
						? 'You'
						: players.find((el) => el.id === message.id)?.name ?? 'Unknown'
					: 'Unknown'}
				:{message.message}
			</p>
		{/each}
	{:else}
		<p>No messages</p>
	{/if}
</div>
{#if players.length > 0}
	<h2>Players</h2>
	<ul>
		<!-- players sorted by playerOrder -->
		<!-- {#each playerOrder as id}
			<li>{players.find((el) => el.id === id)?.name ?? 'Unknown'}</li>
		{/each} -->
		<div
			use:dragHandleZone={{
				items: dndObject
			}}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			{#each dndObject as dndObject (dndObject.id)}
				<div class="flex gap-2" animate:flip={{ duration: flipDurationMs }}>
					<div use:dragHandle aria-label="drag-handle for {dndObject.name}" class="handle">
						<GripVertical />
					</div>
					<span>
						{players.find((el) => el.id === dndObject.id)?.name ?? 'Unknown'}
					</span>
				</div>
			{/each}
		</div>
	</ul>
{:else}
	<p>No players</p>
{/if}
</div>
