<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Achievement } from '$lib/games/games';
	export let game: {
		name: string;
		description: string;
		minPlayers: number;
		maxPlayers: number;
		enabled: boolean;
		achievements: Achievement[];
	};
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Play!</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Let's play {game.name}!</Dialog.Title>
			<Dialog.Description>
				{game.description}
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
            ... list of all ongoing games
		</div>
		<Dialog.Footer>
			<Button type="submit">Create a new lobby instead</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
