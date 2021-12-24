<script>
	import { onDestroy } from 'svelte'
	import { foundGifs, matchedGifs, MAX_CLICKS_ON_GIFS } from '@/lib/stores/game'

	export let gif = { url: '', discovered: false }
	export let index = 0

	let borderColor = 'border-secondary'
	let clicked = false
	const videoWrapperSize = 250
	const videoStyle = `width: ${videoWrapperSize}px; max-width: ${videoWrapperSize}px; height: ${videoWrapperSize}px; max-height: ${videoWrapperSize}px;`

	$: videoClass = `border-2 rounded-md pressable std-hover--scale ${borderColor}`
	$: {
		checkStyle()
	}

	function checkStyle() {
		if (gif.discovered) {
			borderColor = 'border-success'
		} else if (clicked) {
			borderColor = 'border-yellow'
		} else {
			borderColor = 'border-secondary'
		}
	}

	function handleClick() {
		if ($foundGifs.length < MAX_CLICKS_ON_GIFS) {
			clicked = true
			foundGifs.update((val) => [...val, gif.url])
		}
	}

	const unsubscribeFoundGifs = foundGifs.subscribe((gifs) => {
		if (gifs.isEmpty()) {
			clicked = false
		}
		checkStyle()
	})

	const unsubscribeMatchedGifs = matchedGifs.subscribe((gifs) => {
		if (gifs.includes(gif.url)) {
			gif.discovered = true
			checkStyle()
		}
	})

	onDestroy(() => {
		unsubscribeFoundGifs()
		unsubscribeMatchedGifs()
	})
</script>

<div class="p-sm">
	<div
		class="{clicked ? 'flip-horizontally' : 'flip-horizontally--back'} text-no-select"
		style={videoStyle}
	>
		{#if gif.discovered || clicked}
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
