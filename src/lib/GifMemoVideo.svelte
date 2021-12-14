<script>
	export let gif = ''
	const videoWrapperSize = 250
	const videoStyle = `width: ${videoWrapperSize}px; max-width: ${videoWrapperSize}px;
						height: ${videoWrapperSize}px; max-height: ${videoWrapperSize}px;`
	const videoClass = 'border-secondary border-2 rounded-md'
</script>

<div class="p-sm">
	<video src={gif} autoplay muted loop style={videoStyle} class={videoClass} />
</div>
