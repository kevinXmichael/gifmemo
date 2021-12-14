/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter(),
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
};

export default config;
