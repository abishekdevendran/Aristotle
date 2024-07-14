<script lang="ts">
	export let data;
	import ConnectionStatus from '$lib/components/ConnectionStatus.svelte';
	import { onMount } from 'svelte';
	onMount(() => {
		data.socket?.send(
			JSON.stringify({
				event: 'join'
			})
		);
	});
</script>

{#if data.socket}
	<ConnectionStatus socket={data.socket} />
{/if}
<div>
	{JSON.stringify(data)}
</div>
