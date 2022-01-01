<script>
	import { onDestroy } from 'svelte'
	import { gameState, gameInfoLocal, MAX_CLICKS_ON_GIFS, socket } from '@/lib/stores/game'
	import { STD_TIME_OUT } from './stores/game'

	export let gif = { clicked: false, foundBy: false, url: '' }
	export let index = 0

	let borderColor = 'border-secondary'
	const videoWrapperSize = 250
	const videoStyle = `width: ${videoWrapperSize}px; max-width: ${videoWrapperSize}px; height: ${videoWrapperSize}px; max-height: ${videoWrapperSize}px;`

	$: videoClass = `std-border std-hover--scale pressable ${borderColor}`

	function checkStyle() {
		if (gif.foundBy) {
			borderColor = 'border-success'
		} else if (gif.clicked) {
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
			let resetFoundGifs = false
			gameState.update((gameState_) => {
				gameState_.gifs.all[index].clicked = true
				gameState_.gifs.found.push(gif.url)
				if (gameState_.gifs.found.length >= MAX_CLICKS_ON_GIFS) {
					if (gifsMatch(gameState_.gifs.found)) {
						// 1. Set found by
						const foundBy = getFoundBy(gameState_)
						if (gameState_.gifs.found.includes(gif.url)) {
							for (const gif_ of gameState_.gifs.all) {
								if (gif_.url === gameState_.gifs.found[0].url) {
									gif_.foundBy = foundBy
								}
							}
						}
						// 2. Update score
						if (gif.foundBy === gameState_.host.username) {
							gameState_.host.score++
						} else {
							gameState_.client.score++
						}
					} else {
						// If gifs don't match, also reset found gifs and also change player
						gameState_.host.active = !gameState_.host.active
						gameState_.client.active = !gameState_.client.active
					}
					// 3. Reset found by
					resetFoundGifs = true
				}
				return gameState_
			})
			socket.emit('game-new-state-server', $gameState)

			setTimeout(() => {
				// Reset all clicks
				gameState.update((gameState_) => {
					if (resetFoundGifs) {
						gameState_.gifs.found = []
						for (const gif_ of gameState_.gifs.all) {
							gif_.clicked = false
						}
					}
					return gameState_
				})
				socket.emit('game-new-state-server', $gameState)
			}, STD_TIME_OUT)
		}
	}

	function gifsMatch(gifs_ = []) {
		return gifs_.length === MAX_CLICKS_ON_GIFS && gifs_.allEqual()
	}

	function getFoundBy(gameState_) {
		return gameState_.host.active ? gameState_.host.username : gameState_.client.username
	}

	const unsubscribeGameState = gameState.subscribe((gameState_) => checkStyle())
	onDestroy(() => {
		unsubscribeGameState()
	})
</script>

<div class="p-sm">
	<div class="text-no-select" style={videoStyle}>
		{#if gif.foundBy || gif.clicked}
			<video src={gif.url} autoplay muted loop style={videoStyle} class={videoClass} />
		{:else}
			<div class={videoClass} style="{videoStyle} position: relative;" on:click={handleClick}>
				<img alt="card-back" src="card-back.svg" />
				<h2 style="position: absolute; left: 1rem; top: 1rem;">{index + 1}</h2>
			</div>
		{/if}
	</div>
</div>
