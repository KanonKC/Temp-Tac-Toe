<script lang="ts">
	interface Props {
		user: {
			display_name: string;
			avatar_url: string;
		} | null;
	}

	let { user }: Props = $props();
</script>

<nav class="flex w-full items-center justify-between bg-zinc-900 p-4 text-white shadow-md">
	<div class="text-xl font-bold">Temp Tac Toe</div>
	<div>
		{#if user}
			<div class="flex items-center gap-3">
				<span class="font-medium">{user.display_name}</span>
				<img
					src={user.avatar_url}
					alt={user.display_name}
					class="h-10 w-10 rounded-full border border-zinc-700"
				/>
			</div>
		{:else}
			<a
				href="/login"
				class="rounded-lg bg-[#5865F2] px-4 py-2 font-medium text-white transition hover:bg-[#4752C4]"
			>
				Login with Discord
			</a>
		{/if}
	</div>
</nav>
