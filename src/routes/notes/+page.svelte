<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data, form } = $props();

	const problems = {
		empty: () => m.notes_problem_empty(),
		'too-long': () => m.notes_problem_too_long({ max: data.maxLength })
	};
	const writtenAt = new Intl.DateTimeFormat(getLocale(), {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
</script>

<h1 class="text-3xl font-bold tracking-tight">{m.notes_title()}</h1>
<p class="text-muted-foreground">{m.notes_lead()}</p>

<form method="POST" use:enhance class="flex flex-col gap-2">
	<Label for="text">{m.notes_new()}</Label>
	<div class="flex gap-2">
		<Input
			id="text"
			name="text"
			value={form && 'text' in form ? form.text : ''}
			aria-invalid={form && 'problem' in form ? true : undefined}
			aria-describedby={form && 'problem' in form ? 'problem' : undefined}
		/>
		<Button type="submit">{m.notes_save()}</Button>
	</div>
	{#if form && 'problem' in form && form.problem}
		<p id="problem" class="text-sm text-destructive">{problems[form.problem]()}</p>
	{/if}
</form>

{#if data.notes.length === 0}
	<p class="text-muted-foreground">{m.notes_none()}</p>
{:else}
	<ul class="flex flex-col gap-3">
		{#each data.notes as note (note.id)}
			<li>
				<Card.Root>
					<Card.Content>
						<p>{note.text}</p>
						<p class="text-xs text-muted-foreground">{writtenAt.format(note.writtenAt)}</p>
					</Card.Content>
				</Card.Root>
			</li>
		{/each}
	</ul>
{/if}
