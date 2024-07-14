<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import Navbar from '$lib/components/Navbar.svelte';
	import { setUser } from '$lib/stores/index';
	import { SetSocket } from '$lib/stores/socket';
	setUser(null);
	SetSocket(null);
</script>

<ModeWatcher />
<Toaster position="top-center" closeButton richColors />
<main class="font-lexend flex min-h-svh flex-col items-center gap-2 p-0 m-0">
	<Navbar />
	<slot />
</main>
