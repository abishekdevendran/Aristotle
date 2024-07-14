<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<div class="flex flex-grow pb-32 flex-col items-center justify-center">
	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="min-w-96 text-2xl">Login</Card.Title>
			<Card.Description>Use one of the following OAuth methods</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<!-- <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
              </div>
              <Button type="submit" class="w-full">Login</Button> -->
				<Button variant="outline" class="w-full" href="/login/github">Login with Github</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>
