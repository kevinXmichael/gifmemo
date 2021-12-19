<script>
	import { _ } from 'svelte-i18n'
	import { fetchGifs } from '@/lib/gifs'
	import GifMemoVideo from '@/lib/GifMemoVideo.svelte'

	const gifs = fetchGifs()
</script>

{#await gifs then resultGifs}
	<div class="flex flex-row flex-wrap items-center justify-center">
		{#each resultGifs as gif, index}
			<GifMemoVideo {gif} index={index + 1} />
		{/each}
	</div>
{/await}
