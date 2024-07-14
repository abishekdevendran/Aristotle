<script lang="ts">
	import { browser } from '$app/environment';
	import PartySocket from 'partysocket';
	import { onDestroy, onMount } from 'svelte';
	export let socket: PartySocket;
	const readyStates = {
		[PartySocket.CONNECTING]: {
			text: 'Connecting',
			className: 'bg-yellow-500'
		},
		[PartySocket.OPEN]: {
			text: 'Connected',
			className: 'bg-green-500'
		},
		[PartySocket.CLOSING]: {
			text: 'Closing',
			className: 'bg-orange-500'
		},
		[PartySocket.CLOSED]: {
			text: 'Not Connected',
			className: 'bg-red-500'
		}
	};
	$: readyState = socket?.readyState === 1 ? 1 : 0;
	$: display = readyStates[readyState as keyof typeof readyStates];
	const onStateChange = () => {
		readyState = socket.readyState;
	};
	onMount(() => {
		socket.addEventListener('open', onStateChange);
		socket.addEventListener('close', onStateChange);
	});
	onDestroy(() => {
		if (browser) {
			socket.removeEventListener('open', onStateChange);
			socket.removeEventListener('close', onStateChange);
		}
	});
</script>

<div
	class="flex items-center justify-center gap-2 rounded-full border bg-primary px-3 py-1 shadow-md sm:py-2"
>
	<p>
		{readyStates[readyState].text}
	</p>
	<div class={`h-3 w-3 rounded-full ${display.className}`}></div>
</div>
