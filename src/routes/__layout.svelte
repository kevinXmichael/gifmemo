<script>
	import '@/styles/app.scss'
	import boot from '@/lib/boot'

	import { register, init, _ } from 'svelte-i18n' // https://github.com/kaisermann/svelte-i18n
	import Footer from '@/lib/Footer.svelte'
	import Header from '@/lib/Header.svelte'

	async function setup() {
		register('en', () => import('@/i18n/en.json'))

		return await Promise.allSettled([init({ initialLocale: 'en', fallbackLocale: 'en' })])
	}

	const setupResult = setup()
	const bootfile = boot()
</script>

{#await bootfile then resultBoot}
	<Header />

	{#await setupResult then result}
		<main class="m-auto" style="padding-bottom: var(--footer-height);">
			<slot />
		</main>
	{/await}

	<Footer />
{/await}
