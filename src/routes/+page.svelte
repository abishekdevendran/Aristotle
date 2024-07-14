<script lang="ts">
	import PlayModal from '$lib/components/PlayModal.svelte';
	export let data;
	import { getUser } from '$lib/stores/index.js';
	const user = getUser();
	$: $user = data.user;
</script>

<svelte:head>
	<title>Dashboard | Aristotle</title>
</svelte:head>
<div class="container flex w-full flex-col">
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
