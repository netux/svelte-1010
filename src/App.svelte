<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	import Piece from './Piece.svelte';

	import { Array2D } from './array2d';
	import type { PieceData } from './pieces';
	import { Pieces } from './pieces';


	type CellState = {
		filled: true,
		color: string
	} | {
		filled: false,
		color?: string
	};


	export let boardWidth: number;
	export let boardHeight: number;

	let state: Array2D<CellState> | null = null;
	let availablePieces: [(PieceData | null), (PieceData | null), (PieceData | null)] = [null, null, null];
	let selectedPiece = -1;
	let score = 0;
	let hasLost = false;

	const getBestScore = () => {
		const score = parseInt(window.localStorage.getItem('bestScore'), 10);
		return isNaN(score) ? 0 : score;
	}
	const setBestScore = (score: number) => {
		window.localStorage.setItem('bestScore', score.toString());
	}

	$: lastBestScore = getBestScore();
	$: if (score > lastBestScore) {
		setBestScore(score);
		lastBestScore = score;
	}

	function setup() {
		score = 0;
		selectedPiece = -1;
		hasLost = false;

		state = new Array2D(boardWidth, boardHeight).map2D(() => ({ filled: false }));
		randomizeAvailablePieces();
	}

	onMount(() => {
		setup();
	});

	$: if (state != null && !hasLost) {
		requestAnimationFrame(() => {
			// run right after to allow the DOM to update with the new cells
			clearLines();
			checkLoseState();
		});
	}

	function clearLines() {
		const newState = Array2D.from(state);
		let newScore = score;

		for (let y = 0; y < state.height; y++) {
			const row = state[y];
			if (row.every(({ filled }) => filled)) {
				for (let x = 0; x < state.width; x++) {
					newState[y][x].filled = false;
				}
				newScore += 10;
			}
		}

		for (let x = 0; x < state.width; x++) {
			let hasEmptySpot = false;
			for (let y = 0; y < state.height; y++) {
				if (!state[y][x].filled) {
					hasEmptySpot = true;
					break;
				}
			}

			if (!hasEmptySpot) {
				for (let y = 0; y < state.height; y++) {
					newState[y][x].filled = false;
				}
				newScore += 10;
			}
		}

		state = newState;
		score = newScore;
	}
	function checkLoseState() {
		const canPlaceAPiece = availablePieces.some((piece) => {
			return piece != null && state.some2D((_, x, y) => canFit(x, y, piece));
		});
		if (!canPlaceAPiece) {
			hasLost = true;
		}
	}

	function randomizeAvailablePieces() {
		for (let i = 0; i < availablePieces.length; i++) {
			availablePieces[i] = Pieces[Math.floor(Math.random() * Pieces.length)]
		}
	}

	function canFit(offX: number, offY: number, piece: PieceData): boolean {
		if (offX + piece.format.width > boardWidth || offY + piece.format.height > boardHeight) {
			return false;
		}
		return piece.format.every2D((active, pieceX, pieceY) => {
			const { filled } = state[offY + pieceY][offX + pieceX];
			return !(active && filled);
		});
	}

	let lastMouseX: number | null = null;
	let lastMouseY: number | null = null;

	function handleCellPointerUp(cellX: number, cellY: number, _ev: MouseEvent) {
		if (hasLost || selectedPiece === -1) {
			return;
		}

		const pieceData = availablePieces[selectedPiece];
		if (!canFit(cellX, cellY, pieceData)) {
			return;
		}

		const newState = state;
		let newScore = score;
		pieceData.format.forEach2D((active, pieceX, pieceY) => {
			if (active) {
				newState[cellY + pieceY][cellX + pieceX] = {
					filled: true,
					color: pieceData.color
				};
				newScore++;
			}
		});
		state = newState;
		score = newScore;

		availablePieces[selectedPiece] = null;
		selectedPiece = -1;
		if (availablePieces.every((piece) => piece == null)) {
			randomizeAvailablePieces();
		}
	}

	function handlePiecePointerDown(pieceIdx: number, ev: MouseEvent) {
		if (hasLost) {
			return;
		}

		selectedPiece = selectedPiece === pieceIdx ? -1 : pieceIdx;

		lastMouseX = ev.clientX;
		lastMouseY = ev.clientY;
	}

	function handleAppPointerMove(ev: MouseEvent) {
		if (hasLost || selectedPiece === -1) {
			return;
		}

		lastMouseX = ev.clientX;
		lastMouseY = ev.clientY;
	}

	function handleAppPointerUp(_ev: MouseEvent) {
		if (selectedPiece === -1) {
			return;
		}

		selectedPiece = -1;
	}
</script>

<main
	on:pointermove={handleAppPointerMove}
	on:pointerup={handleAppPointerUp}
>
	<div class="score">
		<span class="score__current">{score}</span> / <span class="score__best">{lastBestScore}</span>
	</div>
	<div
		class="board"
		class:board--has-selected={selectedPiece !== -1}
		style="--board-width: {boardWidth}; --board-height: {boardHeight};"
	>
		{#if state != null}
			{#each Array.from(state.entries2D()) as [x, y, cell]}
				<div
					class="cell"
					class:cell--empty={!cell.filled}
					style={cell.color != null ? `--color: ${cell.color}` : ''}
					on:pointerup={handleCellPointerUp.bind(null, x, y)}
				></div>
			{/each}
		{/if}
	</div>
	<div class="available-pieces">
		{#each availablePieces as piece, idx}
			<div
				class="piece-container"
				on:pointerdown={handlePiecePointerDown.bind(null, idx)}
			>
				{#if piece}
					<Piece
						data={piece}
						style={
							selectedPiece === idx
								? `
									position: fixed;
									top: ${lastMouseY}px;
									left: ${lastMouseX}px;
									padding: 1em 0 0 1em;
									pointer-events: none;
								`
								: ''
						}
					/>
				{/if}
			</div>
		{/each}
	</div>
	{#if hasLost}
		<div class="lose-overlay">
			<h1>Game Over</h1>
			<button on:click={setup}>Play again</button>
		</div>
	{/if}
</main>

<style>
	main {
		width: inherit;
		max-width: 800px;
		height: inherit;
		padding: 1em;
		margin: 0 auto;
		font-family: sans-serif;
		display: grid;
		align-content: center;
		grid-template:
			"score" min-content
			"board" min-content
			"pieces" min-content / auto;
	}

	main * {
		user-select: none;
	}

	.score {
		margin: 0.5em 0;
		grid-area: score;
		font-size: 2em;
		text-align: center;
	}
	.score__current {
		color: #5C71E3;
	}
	.score__best {
		color: #A9D47D;
	}

	.board {
		padding: 0 1em;
		grid-area: board;
		display: grid;
		grid-gap: 3px;
		grid-template: repeat(var(--board-height), 1fr) / repeat(var(--board-width), 1fr);
	}

	.cell {
		position: relative;
		width: 100%;
		padding-bottom: 100%; /* make cell's width the same as its height */
		background-color: #353535;
	}
	.cell::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: inherit;
		transform-origin: center center;
		background-color: var(--color, green);
		transform: scale(1);
	}
	.cell.cell--empty::after {
		transition: transform 0.1s linear;
		transform: scale(0);
	}

	.board.board--has-selected .cell {
		cursor: pointer;
	}

	.available-pieces {
		width: 100%;
		min-height: 12em;
		margin: 0.5em;
		justify-self: center;
		justify-content: space-between;
		grid-area: pieces;
		display: flex;
		align-items: center;
	}

	.piece-container {
		width: 100%;
		padding: 2ch;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.lose-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		color: white;
		border-radius: inherit;
		background-color: rgba(0, 0, 0, .5);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}
	.lose-overlay > * {
		margin: 0 auto;
	}

	@media (min-width: 458px) {
		main {
			grid-template-columns: 2fr 1fr;
			grid-template-rows: min-content max-content;
			grid-template-areas:
				"score ."
				"board pieces";
		}

		.board {
			padding: 0.5em 0;
		}

		.available-pieces {
			flex-direction: column;
		}

		.piece-container {
			width: 100%;
			height: 100%;
		}
	}
</style>
