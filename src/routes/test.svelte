<script>
	import { io } from 'socket.io-client'
	const socket = io('ws://localhost:3030')

	socket.on('message', (message) => {
		console.log('message IS', message)
	})

	socket.on('connect', () => {
		console.log('connected!', socket.id)
	})

	socket.on('disconnect', () => {
		console.log('A user disconnected')
	})

	function handleSocketClick() {
		console.log('handleSocketClick... EVENT')
		socket.emit('message', { data: '=> ### handleSocketClick test', b: false })
	}
</script>

<h1>Test test test</h1>

<button class="bg-primary text-secondary" on:click={handleSocketClick}>handleSocketClick</button>
