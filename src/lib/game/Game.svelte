<script>
	import { t } from '@/i18n'
	import { onDestroy } from 'svelte'
	import { io } from 'socket.io-client'
	import { gameState, gameInfoLocal } from '@/lib/stores/game'
	import GifMemoVideo from '@/lib/GifMemoVideo.svelte'
	const socket = io('ws://localhost:3030', { autoConnect: false })

	onDestroy(() => {
		socket.disconnect()
		// socket.to($gameState.hostID).emit('host-disconnected')
		// socket.emit('host-disconnected', $gameState.hostID)
	})
	socket.connect()
</script>

{#if $gameInfoLocal.gameInitialized}
	<div class="flex flex-row flex-wrap items-center justify-center mb-md">
		{#each $gameState.gifs as gif, index}
			<GifMemoVideo {gif} index={index + 1} />
		{/each}
	</div>
{:else}
	<h2>{$t('general.connection.pending')}</h2>
{/if}
