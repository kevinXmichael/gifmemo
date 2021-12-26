<script>
	import { t } from '@/i18n'
	import { page } from '$app/stores'
	import { io } from 'socket.io-client'
	import { onMount } from 'svelte'
	// import { goto } from '$app/navigation'
	import {
		gameState,
		gameInfoLocal,
		resetGame,
		initGame,
		updateGame,
		updateGameInfoLocal
	} from '@/lib/stores/game'
	import { NETWORK_STATUS } from '@/lib/network'
	import { copyToClipboard } from '@/lib/utils'

	const socket = io('ws://localhost:3030', { autoConnect: false })
	let connected = false
	let localHostID = ''
	let networkStatus = false

	socket.on('connect', () => {
		connected = true
	})

	socket.on('game-join-rejected-client', () => {
		alert('This game is already full')
		networkStatus = NETWORK_STATUS.FAILED
	})

	socket.on('game-join-accepted-client', (gameState) => {
		updateGameInfoLocal('gameInitialized', updateGame(gameState))
		networkStatus = NETWORK_STATUS.LOADED
	})

	// Server only
	socket.on('game-new-session-created', (hostID_) => {
		const newGameState = { ...$gameState }
		newGameState.host.id = hostID_
		updateGameInfoLocal('isHost', true)
		updateGameInfoLocal('gameInitialized', updateGame(newGameState))
	})

	// Server only
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
			networkStatus = NETWORK_STATUS.PENDING
		}
	}

	onMount(() => {
		localHostID = $page.query?.get?.('hostID') ?? localHostID
	})
	socket.connect()
</script>

{#if connected}
	{#if networkStatus !== NETWORK_STATUS.LOADED}
		<div class="flex flex-row w-full h-full items-center justify-center">
			{#if $gameInfoLocal.isHost}
				<div class="flex flex-row w-full" on:click={() => copyToClipboard($gameState.host?.id)}>
					<p>{$t('game.info.shareID', { hostID: $gameState.host.id })}</p>
					<button class="ml-sm">{$t('general.header.copy')}</button>
				</div>
			{:else}
				<button class="bg-primary" on:click={createNewGameSession}>{$t('game.create')}</button>
				<div class="spacer" />
				<button class="bg-primary" on:click={joinGame}>{$t('game.join.caption')}</button>
				<input
					bind:value={localHostID}
					placeholder={$t('game.join.placeholder')}
					class="bg-primary"
				/>
			{/if}
		</div>
	{/if}
{/if}
