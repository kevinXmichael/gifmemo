const plugin = require('tailwindcss/plugin')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [
		plugin(function({ addBase, theme }) {
			addBase({
				'h1': { fontSize: theme('fontSize.2xl') },
				'h2': { fontSize: theme('fontSize.xl') }
			})
		})
	],
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
		},
		spacing: {
			xs: '0.25rem',
			sm: '0.5rem',
			md: '1.0rem',
			lg: '2.0rem',
			xl: '4.0rem',
		},
		colors: {
			'primary': 'var(--primary)',
			'secondary': 'var(--secondary)'
		},
		fontFamily: {
			'roboto': ['Roboto', 'sans-serif']
		}
	},
};

module.exports = config;
