<script>
	import { t } from '@/i18n'
	import { gameState, gameInfoLocal, STD_TIME_OUT } from '@/lib/stores/game'
	import { copyToClipboard } from '@/lib/utils'

	let copiedToClipboard = false
	$: classHost = `${$gameState.host.active ? 'text-yellow' : ''}`
	$: classClient = `${$gameState.client.active ? 'text-yellow' : ''}`

	async function copyToClipboard_() {
		copiedToClipboard = await copyToClipboard($gameState.host?.id)
		if (copiedToClipboard) {
			setTimeout(() => (copiedToClipboard = false), STD_TIME_OUT)
		}
	}
</script>

<div class="flex flex-row w-full h-full items-center justify-center">
	{#if $gameInfoLocal.isHost}
		{#if copiedToClipboard}
			<p>{$t('game.info.copiedHostID')}</p>
		{:else}
			<div
				class="flex flex-col h-full w-full justify-center items-center"
				on:click={copyToClipboard_}
			>
				<p>{$t('game.info.copyHostID')}</p>
				<p class="text-cut">{$gameState.host.id}</p>
			</div>
		{/if}
		<div class="spacer mr-sm" />
	{/if}
	<div class="flex flex-row w-full items-center justify-center">
		<div class="flex flex-col w-full">
			<h1 class={classHost}>{$gameState.host.username}</h1>
			<h2 class={classHost}>{$gameState.host.score}</h2>
		</div>
		<div class="flex flex-col w-full items-center justify-center">
			{#if $gameState.client.username}
				<h1 class={classClient}>{$gameState.client.username}</h1>
				<h2 class={classClient}>{$gameState.client.score}</h2>
			{:else}
				<h1 class={classClient}>{$t('game.info.notReady')}</h1>
			{/if}
		</div>
	</div>
</div>
