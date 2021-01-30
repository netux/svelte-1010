<script lang="ts">
	import type { PieceData } from './pieces';

	export let style = '';
	export let data: PieceData;

	$: width = data.format.width;
	$: height = data.format.height;
</script>

<main style="--width: {width}; --height: {height}; --color: {data.color}; {style ?? ''}">
	{#each Array.from(data.format.values2D()) as active}
		<div class="cell" class:cell--filled={active}></div>
	{/each}
</main>

<style>
	main {
		display: inline-grid;
		grid-template: repeat(var(--height), minmax(1.5em, 4vmin)) / repeat(var(--width), minmax(1.5em, 4vmin));
		grid-gap: 2px;
	}

	.cell {
		border-radius: 4px;
	}
	.cell--filled {
		background-color: var(--color);
	}
</style>
