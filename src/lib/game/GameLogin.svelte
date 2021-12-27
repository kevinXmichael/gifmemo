<script>
	import { t } from '@/i18n'
	import { page } from '$app/stores'
	import { io } from 'socket.io-client'
	import { onMount } from 'svelte'
	import {
		gameState,
		gameNetworkStatus,
		resetGame,
		initGame,
		updateGame,
		updateGameInfoLocal
	} from '@/lib/stores/game'
	import { NETWORK_STATUS } from '@/lib/network'

	const socket = io('ws://localhost:3030', { autoConnect: false })
	let connected = false
	let localHostID = ''

	socket.on('connect', () => {
		connected = true
	})

	socket.on('game-join-rejected-client', () => {
		alert('This game is already full')
		gameNetworkStatus.set(NETWORK_STATUS.FAILED)
	})

	socket.on('game-join-accepted-client', (gameState) => {
		updateGameInfoLocal('gameInitialized', updateGame(gameState))
		gameNetworkStatus.set(NETWORK_STATUS.LOADED)
	})

	socket.on('game-new-session-created', (hostID_) => {
		const newGameState = { ...$gameState }
		newGameState.host.id = hostID_
		updateGameInfoLocal('isHost', true)
		updateGameInfoLocal('gameInitialized', updateGame(newGameState))
	})

	socket.on('game-join-asked', (clientID) => {
		if ($gameState.client.id) {
			// $gameState.guestIDs.add(clientID)
			socket.emit('game-join-rejected-server', clientID)
		} else {
			const newGameState = { ...$gameState }
			newGameState.client.id = clientID
			updateGameInfoLocal('gameInitialized', updateGame(newGameState))
			socket.emit('game-join-accepted-server', $gameState)
		}
	})

	socket.on('game-state-updated', (newGameState) => {
		updateGameInfoLocal('gameInitialized', updateGame(newGameState))
	})

	for (const event in ['disconnected', 'host-disconnected', 'game-canceled']) {
		socket.on(event, (hostID) => {
			resetGame()
		})
	}

	async function createNewGameSession() {
		if (connected) {
			await initGame()
			updateGameInfoLocal('gameInitialized', true)
			socket.emit('game-new-session', $gameState)
		}
	}

	function joinGame() {
		if (localHostID.isOnlyWhitespace()) {
			alert('please enter a hostID')
		} else {
			socket.emit('game-join', { clientID: socket.id, hostID: localHostID })
			gameNetworkStatus.set(NETWORK_STATUS.PENDING)
		}
	}

	onMount(() => {
		localHostID = $page.query?.get?.('hostID') ?? localHostID
	})
	socket.connect()
</script>

{#if connected}
	<div class="flex flex-row w-full h-full items-center justify-center">
		<button class="bg-primary" on:click={createNewGameSession}>{$t('game.create')}</button>
		<div class="spacer" />
		<button class="bg-primary" on:click={joinGame}>{$t('game.join.caption')}</button>
		<input bind:value={localHostID} placeholder={$t('game.join.placeholder')} class="bg-primary" />
	</div>
{/if}
