<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { getUser } from '$lib/stores';
	let user = getUser();
</script>

{#if $user?.id}
	<Avatar.Root>
		<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
		<Avatar.Fallback title={$user?.name}
			>{$user?.name
				.split(' ')
				.map((name) => name[0].toLocaleUpperCase())
				.join('')}</Avatar.Fallback
		>
	</Avatar.Root>
{/if}
