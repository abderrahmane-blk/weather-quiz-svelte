<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link
		rel="icon"
		href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%9B%88%EF%B8%8F%3C/text%3E%3C/svg%3E"
	/>
</svelte:head>

{@render children()}

<footer>Demo only, not official safety advice.</footer>