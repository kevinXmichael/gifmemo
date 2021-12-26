<script>
	import { t } from '@/i18n'
	import { copyToClipboard } from '@/lib/utils'
	import { gameState } from '@/lib/stores/game'
</script>

{#if gameState.host?.id}
	<header>
		<nav
			class="flex flex-row flex-nowrap h-full w-full justify-evenly items-center text-center bg-primary"
		>
			<div class="flex flex-row h-full">
				<span>{gameState.host.id}</span>
				<button class="ml-sm" on:click={() => copyToClipboard(gameState.host.id)}
					>{$t('general.header.copy')}</button
				>
			</div>
		</nav>
	</header>
{/if}

<svelte:head>
	<title>{$t('general.page_title')}</title>
</svelte:head>

<style>
	header {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		height: var(--footer-height);
		min-height: var(--footer-height);
		z-index: 5;
	}
</style>
