<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance action="/login?/logout">
	<button>Sign out</button>
</form>
