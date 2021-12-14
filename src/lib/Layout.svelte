<script>
	import { register, init, _ } from 'svelte-i18n' // https://github.com/kaisermann/svelte-i18n
	import Footer from '@/lib/Footer.svelte'

	async function setup() {
		register('en', () => import('@/i18n/en.json'))

		return await Promise.allSettled([init({ initialLocale: 'en', fallbackLocale: 'en' })])
	}

	const setupResult = setup()
</script>

{#await setupResult then result}
	<main style="margin: auto;">
		<slot />
	</main>
{/await}

<Footer />
