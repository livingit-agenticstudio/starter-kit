<script lang="ts" module>
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import HouseIcon from '@lucide/svelte/icons/house';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import { resolve } from '$app/paths';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import { m } from '$lib/paraglide/messages';

	// Overview and Notes are real pages. The other urls are "#" until the team builds the page behind them.
	const navMain = () => [
		{ title: m.nav_overview(), url: resolve('/'), icon: HouseIcon },
		{ title: m.nav_notes(), url: resolve('/notes'), icon: NotebookPenIcon },
		{
			title: m.nav_requests(),
			url: '#',
			icon: InboxIcon,
			items: [
				{ title: m.nav_requests_open(), url: '#' },
				{ title: m.nav_requests_mine(), url: '#' },
				{ title: m.nav_requests_done(), url: '#' }
			]
		},
		{ title: m.nav_documents(), url: '#', icon: FileTextIcon },
		{
			title: m.nav_settings(),
			url: '#',
			icon: Settings2Icon,
			items: [
				{ title: m.nav_settings_general(), url: '#' },
				{ title: m.nav_settings_people(), url: '#' }
			]
		}
	];
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppBrand from './app-brand.svelte';
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user: { name: string; email: string } | null;
	} = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<AppBrand />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={navMain()} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
