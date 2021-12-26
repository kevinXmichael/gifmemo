<script>
	import { t } from '@/i18n'
	import { gameState, gameInfoLocal } from '@/lib/stores/game'
	import GifMemoVideo from '@/lib/GifMemoVideo.svelte'
</script>

{#if $gameInfoLocal.gameInitialized}
	<div class="flex flex-row flex-wrap items-center justify-center mb-md">
		{#each $gameState.gifs as gif, index}
			<GifMemoVideo {gif} index={index + 1} />
		{/each}
	</div>
{:else}
	<h2>{$t('general.connection.pending')}</h2>
{/if}
