<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { loadContent } from '#lib/content.js';

	// Fallback text shows instantly; content.json overrides it once loaded.
	let title = $state('Thunderstorm Safety Quiz');
	let intro = $state('Three quick questions to test what you know about staying safe in a storm.');

	onMount(async () => {
		try {
			const data = await loadContent();
			if (data.homeTitle) title = data.homeTitle;
			if (data.homeIntro) intro = data.homeIntro;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<svelte:head>
	<title>Thunderstorm Safety Quiz (demo)</title>
	<meta name="description" content="A tiny demo quiz about thunderstorm safety. Demo only, not official safety advice." />
</svelte:head>

<main class="card home">
	<p class="big-emoji" aria-hidden="true">⛈️</p>
	<h1>{title}</h1>
	<p class="intro">{intro}</p>
	<a class="btn" href={resolve('/quiz')}>Start quiz</a>
</main>