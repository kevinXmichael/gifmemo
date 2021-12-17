<script>
	export let gif = { url: '', discovered: false }
	export let index = 0

	let borderColor = 'border-secondary'
	let clicked = false
	const videoWrapperSize = 250
	const videoStyle = `width: ${videoWrapperSize}px; max-width: ${videoWrapperSize}px; height: ${videoWrapperSize}px; max-height: ${videoWrapperSize}px;`
	$: videoClass = `border-2 rounded-md pressable std-hover--scale ${borderColor}`

	$: {
		if (clicked) {
			borderColor = 'border-yellow'
		} else if (gif.discovered) {
			borderColor = 'border-success'
		} else {
			borderColor = 'border-secondary'
		}
	}

	function handleClick() {
		clicked = true
	}
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
