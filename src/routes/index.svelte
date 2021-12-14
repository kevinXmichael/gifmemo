<script>
	import { _ } from 'svelte-i18n'
	import { fetchGifs } from '@/lib/gifs'
	import Layout from '@/lib/Layout.svelte'
	import GifMemoVideo from '@/lib/GifMemoVideo.svelte'
	import '../app.css'

	const gifs = fetchGifs(16)
</script>

<Layout>
	{#await gifs then resultGifs}
		<div class="flex flex-row flex-wrap items-center">
			{#each resultGifs as gif, index}
				<GifMemoVideo {gif} />
			{/each}
		</div>
	{/await}
</Layout>
