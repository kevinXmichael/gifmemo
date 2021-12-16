<script>
	export let gif = { url: '', discovered: false }

	let borderColor = 'border-secondary'
	let clicked = false
	const videoWrapperSize = 250
	const videoStyle = `width: ${videoWrapperSize}px; max-width: ${videoWrapperSize}px;
						height: ${videoWrapperSize}px; max-height: ${videoWrapperSize}px;`
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
			<div style={videoStyle} class={videoClass} on:click={handleClick}>
				<h2 class="text-secondary">click mich</h2>
			</div>
		{/if}
	</div>
</div>
