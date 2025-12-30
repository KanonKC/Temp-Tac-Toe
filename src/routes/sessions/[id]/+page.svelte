<script lang="ts">
	import { page } from '$app/state';
	import { fade, scale } from 'svelte/transition';

	// Using $app/stores for broad compatibility, derived for reactivity
	let id = $derived(page.params.id);

	let xMoves = $state<number[]>([]);
	let oMoves = $state<number[]>([]);
	let turn = $state<'X' | 'O'>('X');
	let winner = $state<'X' | 'O' | null>(null);
	let winningLine = $state<number[] | null>(null);

	const WIN_PATTERNS = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	function getBoard(x: number[], o: number[]) {
		const board = Array(9).fill(null);
		x.forEach((pos) => (board[pos] = 'X'));
		o.forEach((pos) => (board[pos] = 'O'));
		return board;
	}

	let board = $derived(getBoard(xMoves, oMoves));

	function checkWin(moves: number[]): number[] | null {
		const moveSet = new Set(moves);
		for (const pattern of WIN_PATTERNS) {
			if (pattern.every((idx) => moveSet.has(idx))) {
				return pattern;
			}
		}
		return null;
	}

	function handleCellClick(index: number) {
		if (board[index] || winner) return;

		if (turn === 'X') {
			xMoves = [...xMoves, index];
			// FIFO Rule: Keep only last 3
			if (xMoves.length > 3) xMoves = xMoves.slice(1);

			const win = checkWin(xMoves);
			if (win) {
				winner = 'X';
				winningLine = win;
				return;
			}
			turn = 'O';
		} else {
			oMoves = [...oMoves, index];
			// FIFO Rule: Keep only last 3
			if (oMoves.length > 3) oMoves = oMoves.slice(1);

			const win = checkWin(oMoves);
			if (win) {
				winner = 'O';
				winningLine = win;
				return;
			}
			turn = 'X';
		}
	}

	function resetGame() {
		xMoves = [];
		oMoves = [];
		turn = 'X';
		winner = null;
		winningLine = null;
	}
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-4 font-sans text-neutral-100"
>
	<div class="flex w-full max-w-md flex-col items-center gap-8">
		<!-- Header -->
		<div class="space-y-2 text-center">
			<h1
				class="bg-gradient-to-br from-indigo-400 to-rose-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent"
			>
				Temp-Tac-Toe
			</h1>
			<p class="text-sm text-neutral-400">
				Session: <span class="font-mono text-indigo-400">{id}</span>
			</p>
			<div class="flex items-center justify-center gap-2 text-sm">
				<span
					class="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-neutral-400"
				>
					Rule: Max 3 Marks (FIFO)
				</span>
			</div>
		</div>

		<!-- Status & Turn Indicator -->
		<div class="relative flex h-16 w-full items-center justify-center">
			{#if winner}
				<div
					in:scale={{ duration: 400, start: 0.9 }}
					class="absolute inset-0 flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-900/20 backdrop-blur-sm"
				>
					<span class="text-2xl font-bold text-emerald-400">
						Player {winner} Wins!
					</span>
				</div>
			{:else}
				<div class="flex items-center gap-8 text-xl font-medium">
					<div
						class="flex items-center gap-2 transition-opacity duration-300 {turn === 'X'
							? 'scale-110 opacity-100'
							: 'scale-100 opacity-30'}"
					>
						<span class="text-rose-400">X</span>
						<span class="text-sm text-neutral-500">Player</span>
					</div>
					<div
						class="flex items-center gap-2 transition-opacity duration-300 {turn === 'O'
							? 'scale-110 opacity-100'
							: 'scale-100 opacity-30'}"
					>
						<span class="text-indigo-400">O</span>
						<span class="text-sm text-neutral-500">Player</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Game Board -->
		<div class="group relative">
			<div
				class="relative grid grid-cols-3 gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-3 shadow-2xl"
			>
				{#each Array(9) as _, i}
					<button
						class="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl text-5xl font-bold transition-all duration-300
						{winningLine?.includes(i) ? 'bg-neutral-800 shadow-inner' : 'bg-neutral-950 hover:bg-neutral-900'}
						focus:ring-2 focus:ring-neutral-700 focus:outline-none disabled:cursor-default"
						onclick={() => handleCellClick(i)}
						disabled={!!winner}
					>
						{#if board[i] === 'X'}
							<div
								in:scale={{ duration: 300, start: 0.5 }}
								out:fade={{ duration: 200 }}
								class="relative flex h-full w-full items-center justify-center text-rose-500"
							>
								X
								<!-- Oldest X indicator removed -->
							</div>
						{:else if board[i] === 'O'}
							<div
								in:scale={{ duration: 300, start: 0.5 }}
								out:fade={{ duration: 200 }}
								class="relative flex h-full w-full items-center justify-center text-indigo-500"
							>
								O
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<!-- Controls -->
		<button
			onclick={resetGame}
			class="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-6 py-2.5 text-neutral-300 shadow-lg transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95"
		>
			Reset Game
		</button>
	</div>
</div>
