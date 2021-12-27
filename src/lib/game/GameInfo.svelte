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
		<div class="spacer mr-sm" />
	{/if}
	<div class="flex flex-row w-full">
		<div class="flex flex-col w-full">
			<h1>{$gameState.host.username}</h1>
			<h2>{$gameState.host.score}</h2>
		</div>
		<div class="flex flex-col w-full">
			<h1>{$gameState.client.username}</h1>
			<h2>{$gameState.client.score}</h2>
		</div>
	</div>
</div>
