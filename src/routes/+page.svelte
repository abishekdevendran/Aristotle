<script lang="ts">
  import Logout from '$lib/components/login/Logout.svelte';
  export let data;
</script>

<svelte:head>
  <title>Dashboard | Aristotle</title>
</svelte:head>
<div class="flex min-h-screen w-full flex-col bg-muted/40">
  {JSON.stringify(data.user)} <Logout/>
</div>