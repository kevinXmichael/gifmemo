<script>
	import { t } from '@/i18n'
	import { gameState, gameInfoLocal } from '@/lib/stores/game'
	import { copyToClipboard } from '@/lib/utils'
</script>

<div class="flex flex-row w-full h-full items-center justify-center">
	{#if $gameInfoLocal.isHost}
		<div class="flex flex-row w-full" on:click={() => copyToClipboard($gameState.host?.id)}>
			<p>{$t('game.info.shareID', { hostID: $gameState.host.id })}</p>
			<button class="ml-sm">{$t('general.header.copy')}</button>
		</div>
	{/if}
</div>
