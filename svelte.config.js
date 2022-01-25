/** @type {import('@sveltejs/kit').Config} */
// import node from '@sveltejs/adapter-node'
import vercel from '@sveltejs/adapter-vercel'
import path from 'path'
import preprocess from 'svelte-preprocess'

const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: vercel(),
		// adapter: node({
			// out: 'dist',
			// precompress: false,
			// env: {
			// 	host: 'localhost',
			// 	port: '8080'
			// }
		// }),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#gifmemo',
		vite: {
			resolve: {
				alias: {
					'@': path.resolve('./src')
				}
			}
		}
	}
}

export default config
