<script>
	const copyright = `© ${new Date().getFullYear()} metab`
</script>

<footer>
	<nav
		class="flex flex-row flex-nowrap h-full w-full justify-center items-center text-center text-secondary bg-primary"
	>
		<h1>{copyright}</h1>
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
	}
</style>
