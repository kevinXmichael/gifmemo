<script>
	import { onDestroy } from 'svelte'
	import { gameState, gameInfoLocal, MAX_CLICKS_ON_GIFS } from '@/lib/stores/game'

	export let gif = { url: '', discoveredBy: false }
	export let index = 0

	let borderColor = 'border-secondary'
	let clicked = false
	const videoWrapperSize = 250
	const videoStyle = `width: ${videoWrapperSize}px; max-width: ${videoWrapperSize}px; height: ${videoWrapperSize}px; max-height: ${videoWrapperSize}px;`

	$: videoClass = `std-border std-hover--scale pressable ${borderColor}`
	$: {
		checkStyle()
	}

	function checkStyle() {
		if (gif.discoveredBy) {
			borderColor = 'border-success'
		} else if (clicked) {
			borderColor = 'border-yellow'
		} else {
			borderColor = 'border-secondary'
		}
	}

	function handleClick() {
		const allowClick =
			($gameInfoLocal.isClient && $gameState.client.active) ||
			($gameInfoLocal.isHost && $gameState.host.active)

		if (allowClick && $gameState.gifs.found.length < MAX_CLICKS_ON_GIFS) {
			clicked = true
			gameState.update((gameState) => {
				gameState.gifs.found.push(gif.url)
				return gameState
			})
		}
	}

	function getDiscoveredBy(gameState) {
		return gameState.host.active ? gameState.host.username : gameState.client.username
	}

	function checkHighscore() {
		if (gif.discoveredBy === gameState.host.username) {
			gameState.host.score++
		} else {
			gameState.client.score++
		}
	}

	const unsubscribeGameState = gameState.subscribe((gameState) => {
		if (gameState.gifs.found.isEmpty()) {
			clicked = false
		}
		if (gameState.gifs.matched.includes(gif.url)) {
			gif.discoveredBy = getDiscoveredBy(gameState)
			checkHighscore()
		}

		checkStyle()
	})

	onDestroy(() => {
		unsubscribeGameState()
	})
</script>

<div class="p-sm">
	<div class="text-no-select" style={videoStyle}>
		{#if gif.discoveredBy || clicked}
			<video src={gif.url} autoplay muted loop style={videoStyle} class={videoClass} />
		{:else}
			<div style="position: relative;">
				<img
					alt="card-back"
					src="card-back.svg"
					style={videoStyle}
					class={videoClass}
					on:click={handleClick}
				/>
				<h2 style="position: absolute; left: 1rem; top: 1rem;">{index}</h2>
			</div>
		{/if}
	</div>
</div>
