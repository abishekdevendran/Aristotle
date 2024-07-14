<script lang="ts">
	import DarkToggle from '$lib/components/DarkToggle.svelte';
	import Logout from '$lib/components/login/Logout.svelte';
	import User from './User.svelte';
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 max-w-screen-2xl items-center justify-between">
		<h1>Aristotle</h1>
		<div class="flex items-center justify-center gap-2 text-center">
			<Logout />
			<DarkToggle />
			<User />
		</div>
	</div>
</header>
