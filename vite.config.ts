import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	server: {
		fs: {
			// Allow serving files from hoisted root node_modules
			allow: ['../..']
		}
	},
	define: {
		'process.env.NODE_ENV': '"production"',
		'process.env.TZ': '"Asia/Seoul"'
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			mode: 'production',
			strategies: "injectManifest",
			scope: "/",
			injectRegister: 'script',

			manifest: {
				short_name: 'LuterGS',
				name: 'LuterGS PWA',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: "#ffffff",
				background_color: "#ffffff"
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			base: "/",
			disable: false,
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/',
			},
			selfDestroying: false
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
