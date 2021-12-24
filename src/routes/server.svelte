<script>
	import { onDestroy } from 'svelte'
	import { io } from 'socket.io-client'
	const socket = io('ws://localhost:3030', { autoConnect: false })
	let connected = false
	let hostID = false

	socket.on('connect', () => {
		connected = true
	})

	socket.on('game-new-session-created', (hostID_) => {
		hostID = hostID_
	})

	function createNewGameSession() {
		if (connected) {
			const gameState = {} // TODO: create and fetch initial gameState
			socket.emit('game-new-session', gameState)
		}
	}

	onDestroy(() => {
		socket.disconnect()
	})
	socket.connect()
</script>

<h1>Welcome</h1>

{#if connected}
	<button class="bg-primary text-secondary" on:click={createNewGameSession}>create game</button>
	{#if hostID}
		<br />
		<p class="text-secondary">Share this id pls: <b>{hostID}</b></p>
	{/if}
{:else}
	<h2 class="text-secondary">You are not connected yet, please wait...</h2>
{/if}
