<script lang="ts">
	import { enhance } from '$app/forms';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<form method="post" use:enhance action="/login?/logout">
	<Button variant="outline" size="icon" title={`Log out`} type="submit"><LogOut /></Button>
</form>
