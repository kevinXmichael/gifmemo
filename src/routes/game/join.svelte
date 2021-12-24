<script>
	import { NETWORK_STATUS } from '@/lib/network'
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'
	import { io } from 'socket.io-client'
	const socket = io('ws://localhost:3030', { autoConnect: false })
	let connected = false
	let clientID = false
	let hostID = ''
	let networkStatus = false

	socket.on('connect', () => {
		connected = true
	})

	socket.on('game-joined', (data) => {
		clientID = data.clientID
		hostID = data.hostID
		networkStatus = NETWORK_STATUS.LOADED
	})

	socket.on('game-join-failed', (data) => {
		clientID = data.clientID
		hostID = data.hostID
		networkStatus = NETWORK_STATUS.FAILED
	})

	function joinGame() {
		if (hostID.isOnlyWhitespace()) {
			alert('please enter a hostID')
		} else {
			socket.emit('game-join', { clientID: socket.id, hostID })
			networkStatus = NETWORK_STATUS.PENDING
		}
	}

	onMount(() => {
		hostID = $page.query?.get?.('hostID') ?? hostID
	})

	onDestroy(() => {
		socket.disconnect()
	})
	socket.connect()
</script>

<h1 class="text-secondary">Welcome</h1>

{#if connected}
	{#if networkStatus !== NETWORK_STATUS.LOADED}
		<input bind:value={hostID} placeholder="host id goes here" class="bg-primary text-secondary" />
		<button class="bg-primary text-secondary" on:click={joinGame}>joinGame</button>
	{/if}

	<div>
		{#if networkStatus === NETWORK_STATUS.PENDING}
			<h2 class="text-secondary">PENDING</h2>
		{:else if networkStatus === NETWORK_STATUS.LOADED}
			<h2 class="text-secondary">LOADED</h2>
			<p class="text-secondary">clientID: {clientID}</p>
			<p class="text-secondary">hostID: {hostID}</p>
		{:else if networkStatus === NETWORK_STATUS.FAILED}
			<h2 class="text-secondary">FAILED</h2>
			<p class="text-secondary">clientID: {clientID}</p>
			<p class="text-secondary">hostID: {hostID}</p>
		{/if}
	</div>
{:else}
	<h2 class="text-secondary">You are not connected yet, please wait...</h2>
{/if}
