<script>
	import { t } from '@/i18n'
	import { onDestroy, onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { io } from 'socket.io-client'
	import { gameState, initGame, updateGame } from '@/lib/stores/game'
	import { NETWORK_STATUS } from '@/lib/network'
	import GifMemoVideo from '@/lib/GifMemoVideo.svelte'

	const socket = io('ws://localhost:3030', { autoConnect: false })
	let connected = false
	let localHostID = ''
	let networkStatus = false
	let gameInitialized = false
	let isHost = false

	socket.on('connect', () => {
		connected = true
	})

	socket.on('game-join-rejected-client', () => {
		alert('This game is already full')
		networkStatus = NETWORK_STATUS.FAILED
	})

	socket.on('game-join-accepted-client', (gameState) => {
		gameInitialized = updateGame(gameState)
		networkStatus = NETWORK_STATUS.LOADED
	})

	// Server only
	socket.on('game-new-session-created', (hostID_) => {
		const newGameState = { ...$gameState }
		newGameState.host.id = hostID_
		gameInitialized = updateGame(newGameState)
		isHost = true
	})

	// Server only
	socket.on('game-join-asked', (clientID) => {
		if ($gameState.client.id) {
			// $gameState.guestIDs.add(clientID)
			socket.emit('game-join-rejected-server', clientID)
		} else {
			const newGameState = { ...$gameState }
			newGameState.client.id = clientID
			gameInitialized = updateGame(newGameState)
			socket.emit('game-join-accepted-server', $gameState)
		}
	})

	socket.on('game-state-updated', (newGameState) => {
		gameInitialized = updateGame(newGameState)
	})

	for (const event in ['disconnected', 'host-disconnected', 'game-canceled']) {
		socket.on(event, (hostID) => {
			// TODO: reset gameState
			// initGame() maybe?
		})
	}

	async function createNewGameSession() {
		if (connected) {
			await initGame()
			gameInitialized = true
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

	onDestroy(() => {
		socket.disconnect()
		// socket.to($gameState.hostID).emit('host-disconnected')
		// socket.emit('host-disconnected', $gameState.hostID)
	})
	socket.connect()
</script>

{#if connected}
	<!-- TODO: also show possible to connect, fetch that data from router -->
	{#if networkStatus !== NETWORK_STATUS.LOADED}
		<div class="flex flex-col w-full">
			<button class="bg-primary" on:click={createNewGameSession}>{$t('game.create')}</button>
			<button class="bg-primary mt-md" on:click={joinGame}>{$t('game.join.caption')}</button>
			<input
				bind:value={localHostID}
				placeholder={$t('game.join.placeholder')}
				class="bg-primary"
			/>
		</div>
	{/if}

	{#if gameInitialized}
		{#if isHost}
			<p>{$t('game.info.shareID', { hostID: $gameState.host.id })}</p>
		{/if}
		<div class="flex flex-row flex-wrap items-center justify-center mb-md">
			{#each $gameState.gifs as gif, index}
				<GifMemoVideo {gif} index={index + 1} />
			{/each}
		</div>
	{/if}
{:else}
	<h2>{$t('general.connection.pending')}</h2>
{/if}
