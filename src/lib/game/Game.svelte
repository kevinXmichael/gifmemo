<script>
	import {
		gameInfoLocal,
		gameState,
		gameNetworkStatus,
		endGame,
		socket,
		updateGame,
		updateGameInfoLocal
	} from '@/lib/stores/game'
	import { t } from '@/i18n'
	import { NETWORK_STATUS } from '@/lib/network'
	import GameLogin from '@/lib/game/GameLogin.svelte'
	import GifMemoVideo from '@/lib/GifMemoVideo.svelte'

	let connected = false

	socket.on('connect', () => {
		connected = true
	})

	socket.on('game-join-rejected-client', () => {
		alert('This game is already full')
		gameNetworkStatus.set(NETWORK_STATUS.FAILED)
	})

	socket.on('game-new-state-client', (gameState_) => {
		console.log('game-new-state-client => isHost?', $gameInfoLocal.isHost)
		gameState.set(gameState_)
	})

	socket.on('game-room-invite', (gameState) => {
		socket.emit('game-room-join', gameState)
	})

	socket.on('game-join-accepted-client', (gameState) => {
		console.log('game-join-accepted-client', gameState)
		const gameInitialized = updateGame(gameState)
		gameInfoLocal.update((gameInfoLocal_) => {
			gameInfoLocal_.isClient = true
			gameInfoLocal_.gameInitialized = gameInitialized
			return gameInfoLocal_
		})
		gameNetworkStatus.set(NETWORK_STATUS.LOADED)
	})

	socket.on('game-new-session-created', (hostID_) => {
		const newGameState = { ...$gameState }
		const gameInitialized = updateGame(newGameState)
		newGameState.host.id = hostID_
		gameInfoLocal.update((gameInfoLocal_) => {
			gameInfoLocal_.isHost = true
			gameInfoLocal_.gameInitialized = gameInitialized
			return gameInfoLocal_
		})
	})

	socket.on('game-join-asked', (data) => {
		if ($gameState.client.id) {
			// $gameState.guestIDs.add(clientID)
			socket.emit('game-join-rejected-server', data)
		} else {
			const newGameState = { ...$gameState }
			newGameState.client.id = data.clientID
			// "Avoid" duplicate username the lazy way
			newGameState.client.username =
				data.username.toLowerCase() === newGameState.host.username.toLowerCase()
					? data.username + '#2'
					: data.username
			updateGameInfoLocal('gameInitialized', updateGame(newGameState))

			socket.emit('game-join-accepted-server', $gameState)
		}
	})

	socket.on('game-canceled', () => {
		endGame()
	})
	socket.connect()
</script>

{#if connected}
	<div class="my-lg">
		{#if $gameInfoLocal.gameInitialized}
			<div class="flex flex-row flex-wrap items-center justify-center mb-md">
				{#if $gameState.client.username}
					{#each $gameState.gifs?.all as gif, index}
						<GifMemoVideo {gif} {index} />
					{/each}
				{:else}
					<h1>{$t('game.info.waitingForOtherPlayer')}</h1>
				{/if}
			</div>
		{:else}
			<GameLogin />
		{/if}
	</div>
{/if}
