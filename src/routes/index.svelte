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
	</Layout>
{/await}
