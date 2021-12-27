<script>
	import {
		gameInfoLocal,
		gameState,
		gameNetworkStatus,
		resetGame,
		socket,
		updateGame,
		updateGameInfoLocal
	} from '@/lib/stores/game'
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

	socket.on('game-join-asked', (data) => {
		if ($gameState.client.id) {
			// $gameState.guestIDs.add(clientID)
			socket.emit('game-join-rejected-server', data)
		} else {
			const newGameState = { ...$gameState }
			newGameState.client.id = data.clientID
			newGameState.client.username = data.username
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
	socket.connect()
</script>

{#if connected}
	{#if $gameInfoLocal.gameInitialized}
		<div class="flex flex-row flex-wrap items-center justify-center mb-md">
			{#each $gameState.gifs as gif, index}
				<GifMemoVideo {gif} index={index + 1} />
			{/each}
		</div>
	{:else}
		<GameLogin />
	{/if}
{/if}
