<script>
	const copyright = `© ${new Date().getFullYear()} metab`
</script>

<footer>
	<nav
		class="flex flex-row flex-nowrap h-full w-full justify-center items-center text-center bg-primary"
	>
		<h2>{copyright}</h2>
	</nav>
</footer>

<style>
	footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: var(--footer-height);
		min-height: var(--footer-height);
		z-index: 5;
	}
</style>
