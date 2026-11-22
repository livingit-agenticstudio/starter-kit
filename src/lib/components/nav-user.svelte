<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { m } from '$lib/paraglide/messages';

	let { user }: { user: { name: string; email: string } | null } = $props();

	const initials = (name: string) =>
		name
			.split(/\s+/)
			.map((part) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton size="lg" class="pointer-events-none">
			<Avatar.Root class="size-8 rounded-lg">
				<Avatar.Fallback class="rounded-lg">{user ? initials(user.name) : '?'}</Avatar.Fallback>
			</Avatar.Root>
			<div class="grid flex-1 text-start text-sm leading-tight">
				<span class="truncate font-medium">{user ? user.name : m.user_nobody()}</span>
				<span class="truncate text-xs">{user ? user.email : m.user_nobody_hint()}</span>
			</div>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
