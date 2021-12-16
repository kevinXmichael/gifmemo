<script>
	import { _ } from 'svelte-i18n'
	import { fetchGifs } from '@/lib/gifs'
	import boot from '@/lib/boot'
	import Layout from '@/lib/Layout.svelte'
	import GifMemoVideo from '@/lib/GifMemoVideo.svelte'
	import '../styles/app.scss'

	const bootfile = boot()
	const gifs = fetchGifs(32)
</script>

{#await bootfile then resultBoot}
	<Layout>
		{#await gifs then resultGifs}
			<div class="flex flex-row flex-wrap items-center justify-center">
				{#each resultGifs as gif, index}
					<GifMemoVideo {gif} />
				{/each}
			</div>
		{/await}
		<!-- <iframe
			src="https://discord.com/widget?id=654982548015022092&theme=dark"
			width="350"
			height="500"
			allowtransparency="true"
			frameborder="0"
			sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
		/> -->
	</Layout>
{/await}
