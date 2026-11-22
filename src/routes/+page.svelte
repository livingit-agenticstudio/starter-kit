<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { m } from '$lib/paraglide/messages';

	let { data } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{m.start_title()}</Card.Title>
		<Card.Description>{m.start_lead()}</Card.Description>
	</Card.Header>
	<Card.Content class="text-sm">
		{data.user ? m.start_signed_in({ name: data.user.name }) : m.start_nobody_signed_in()}
	</Card.Content>
</Card.Root>
