<script>
	import { onMount, tick } from 'svelte';
	import { resolve } from '$app/paths';
	import { loadContent } from '#lib/content.js';

	let questions = $state([]);
	let status = $state('loading'); // 'loading' | 'ready' | 'error'
	let index = $state(0);
	let score = $state(0);
	let chosen = $state(null); // index of the option the person picked, or null
	let finished = $state(false);

	let heading = $state();
	let nextButton = $state();

	let question = $derived(questions[index]);
	let answered = $derived(chosen !== null);
	let isCorrect = $derived(answered && chosen === question.correctOption - 1);
	let isLast = $derived(index === questions.length - 1);

	onMount(async () => {
		try {
			const data = await loadContent();
			if (!Array.isArray(data.questions) || data.questions.length === 0) {
				throw new Error('content.json has no questions');
			}
			questions = data.questions;
			status = 'ready';
		} catch (error) {
			console.error(error);
			status = 'error';
		}
	});

	async function choose(i) {
		if (answered) return;
		chosen = i;
		if (i === question.correctOption - 1) score += 1; // content.json counts from 1
		await tick();
		nextButton?.focus();
	}

	async function next() {
		chosen = null;
		if (isLast) finished = true;
		else index += 1;
		await tick();
		heading?.focus();
	}

	async function restart() {
		index = 0;
		score = 0;
		chosen = null;
		finished = false;
		await tick();
		heading?.focus();
	}
</script>

<svelte:head>
	<title>Quiz | Thunderstorm Safety Quiz (demo)</title>
</svelte:head>

<main>
	<div class="card">
		{#if status === 'loading'}
			<p>Loading questions…</p>
		{:else if status === 'error'}
			<h2>The questions did not load</h2>
			<p>Check that content.json is valid, then reload the page.</p>
			<a class="btn secondary" href={resolve('/')}>Back to home</a>
		{:else if finished}
			<h2 bind:this={heading} tabindex="-1">Quiz complete</h2>
			<p class="score">{score} / {questions.length}</p>
			<div class="actions">
				<button class="btn" type="button" onclick={restart}>Restart</button>
				<a class="btn secondary" href={resolve('/')}>Back to home</a>
			</div>
		{:else}
			<p class="progress">Question {index + 1} of {questions.length}</p>
			<h2 bind:this={heading} tabindex="-1">{question.question}</h2>

			<div class="options">
				{#each question.options as option, i (i)}
					<button
						type="button"
						class="option"
						class:correct={answered && i === question.correctOption - 1}
						class:wrong={answered && i === chosen && !isCorrect}
						disabled={answered}
						onclick={() => choose(i)}
					>
						{option}
					</button>
				{/each}
			</div>

			{#if answered}
				<div class="feedback {isCorrect ? 'ok' : 'bad'}" role="status">
					<p class="verdict">{isCorrect ? '✅ Correct!' : '❌ Not quite.'}</p>
					<p>{question.explanation}</p>
					{#if question.sourceUrl}
						<p>
							Source:
							<a href={question.sourceUrl} target="_blank" rel="noopener noreferrer">
								{question.sourceLabel || 'Source'}
							</a>
						</p>
					{/if}
					<button class="btn" type="button" bind:this={nextButton} onclick={next}>
						{isLast ? 'See my score' : 'Next question'}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</main>
