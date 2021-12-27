<script>
	import { t } from '@/i18n'
	import GameInfo from '@/lib/game/GameInfo.svelte'
	import { gameInfoLocal } from '@/lib/stores/game'
</script>

{#if $gameInfoLocal.gameInitialized}
	<header>
		<nav
			class="flex flex-row flex-nowrap h-full w-full justify-evenly items-center text-center bg-primary"
		>
			<GameInfo />
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
