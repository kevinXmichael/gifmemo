<script context="module">
	import '@/styles/app.scss'
	import { loadTranslations } from '@/i18n'
	import boot from '@/lib/boot'
	import Footer from '@/lib/Footer.svelte'
	import Header from '@/lib/Header.svelte'
	let setupResult = false

	export const load = async ({ page }) => {
		const { path } = page
		const locale = 'en' // get from cookie or user session...
		setupResult = await Promise.allSettled([boot(), loadTranslations(locale, path)])
		return {}
	}
</script>

{#if setupResult}
	<Header />
	<main
		class="m-auto"
		style="padding-top: var(--header-height); padding-bottom: var(--footer-height);"
	>
		<slot />
	</main>
	<Footer />
{/if}
