<script lang="ts">
	import DarkToggle from '$lib/components/DarkToggle.svelte';
	import Logout from '$lib/components/login/Logout.svelte';
	import PlayModal from '$lib/components/PlayModal.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	export let data;
	onMount(() => {
		toast.success(`Welcome back ${data.user.name}!`);
	});
</script>

<svelte:head>
	<title>Dashboard | Aristotle</title>
</svelte:head>
<div class="flex min-h-screen w-full flex-col bg-muted/40">
	{JSON.stringify(data.user)}
	<Logout />
	<DarkToggle />
	{#await data.games}
		<div>Loading</div>
	{:then games}
		{#each games as game}
			<div>
				<h1>{game.name}</h1>
				<p>{game.description}</p>
				<PlayModal {game} />
			</div>
		{/each}
	{/await}
</div>
