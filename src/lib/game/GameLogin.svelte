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

<div class="flex flex-row w-full h-full items-center justify-center px-lg">
	<div class="flex flex-col w-full">
		<h2>{$t('game.create.heading')}</h2>
		<input
			bind:value={username}
			on:keydown={(event) => {
				if (event.key?.toLowerCase() === 'enter') {
					createNewGameSession()
				}
			}}
			placeholder={$t('game.create.placeholder')}
			class="bg-primary my-md"
		/>
		<button class="bg-primary mt-md" on:click={createNewGameSession}
			>{$t('game.create.caption')}</button
		>
	</div>
	<div class="spacer px-lg" />
	<div class="flex flex-col w-full">
		<h2>{$t('game.join.heading')}</h2>
		<input
			bind:value={localHostID}
			on:keydown={(event) => {
				if (event.key?.toLowerCase() === 'enter') {
					joinGame()
				}
			}}
			placeholder={$t('game.join.placeholder')}
			class="bg-primary my-md"
		/>
		<button class="bg-primary mt-md" on:click={joinGame}>{$t('game.join.caption')}</button>
	</div>
</div>
