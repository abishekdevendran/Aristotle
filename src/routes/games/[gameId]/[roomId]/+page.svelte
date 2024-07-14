<script lang="ts">
	export let data;
	import ConnectionStatus from '$lib/components/ConnectionStatus.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getUser } from '$lib/stores/index.js';
	import { GetSocket } from '$lib/stores/socket.js';
	import type { Player } from '$lib/types.js';
	import { toast } from 'svelte-sonner';
	let messages: {
		message: string;
		id?: string;
	}[] = [];
	let players: Player[] = [];
	let playerOrder: string[] = [];
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
					| { type: 'JOIN' | 'LEAVE'; data: { message: string; player: Player } };
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
						players = [...players, msg.data.player];
						playerOrder = [...playerOrder, msg.data.player.id];
					} else{
						players = players.filter((el) => el.id !== msg.data.player.id);
						playerOrder = playerOrder.filter((el) => el !== msg.data.player.id);
					}
				}
			});
			hasEventListenerAdded = true;
		}
	}
	let textInput = '';
</script>

<svelte:head>
	<title>{data.game.name} | {data.roomId} | Aristotle</title>
</svelte:head>
{#if $socket}
	<ConnectionStatus socket={$socket} />
	<form
		on:submit|preventDefault={() => {
			// messages.push({ data: 'You: ' + textInput });
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
{#if messages.length > 0}
	{#each messages as message}
		<p>
			{message.id
				? players.find((el) => el.id === message.id)?.name ?? 'Unknown'
				: 'You: '}:{message.message}
		</p>
	{/each}
{:else}
	<p>No messages</p>
{/if}
{#if players.length > 0}
	<h2>Players</h2>
	<ul>
		<!-- players sorted by playerOrder -->
		{#each playerOrder as id}
			<li>{players.find((el) => el.id === id)?.name ?? 'Unknown'}</li>
		{/each}
	</ul>
{:else}
	<p>No players</p>
{/if}
