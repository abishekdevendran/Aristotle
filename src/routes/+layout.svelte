<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import { user } from '$lib/stores/index';
</script>

<ModeWatcher />
<Toaster position="top-center" closeButton richColors />
<main class="flex min-h-svh items-center justify-center">
	<slot />
</main>
