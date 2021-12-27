<script>
	import { t } from '@/i18n'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import {
		gameState,
		gameNetworkStatus,
		initGame,
		socket,
		updateGameInfoLocal
	} from '@/lib/stores/game'
	import { NETWORK_STATUS } from '@/lib/network'

	let localHostID = ''
	let username

	function hasUsername() {
		return !(username?.isOnlyWhitespace?.() ?? true)
	}

	async function createNewGameSession() {
		if (hasUsername()) {
			await initGame(username)
			updateGameInfoLocal('gameInitialized', true)
			socket.emit('game-new-session', $gameState)
		} else {
			alert('Please enter a username')
		}
	}

	function joinGame() {
		if (!hasUsername()) {
			alert('Please enter a username')
		} else if (localHostID.isOnlyWhitespace()) {
			alert('please enter a hostID')
		} else {
			socket.emit('game-join', { clientID: socket.id, hostID: localHostID, username })
			gameNetworkStatus.set(NETWORK_STATUS.PENDING)
		}
	}

	onMount(() => {
		localHostID = $page.query?.get?.('hostID') ?? localHostID
	})
</script>

<div class="flex flex-row w-full h-full items-center justify-center">
	<button class="bg-primary" on:click={createNewGameSession}>{$t('game.create.caption')}</button>
	<input bind:value={username} placeholder={$t('game.create.placeholder')} class="bg-primary" />
	<div class="spacer" />
	<button class="bg-primary" on:click={joinGame}>{$t('game.join.caption')}</button>
	<input bind:value={localHostID} placeholder={$t('game.join.placeholder')} class="bg-primary" />
</div>
