<script>
	import { t } from '@/i18n'
	import { gameState } from '@/lib/stores/game'
	import GameConfig from '@/lib/game/GameConfig.svelte'
</script>

<header>
	<nav
		class="flex flex-row flex-nowrap h-full w-full justify-evenly items-center text-center bg-primary"
	>
		<GameConfig />
	</nav>
</header>

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
