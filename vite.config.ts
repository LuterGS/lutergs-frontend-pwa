import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	server: {
		fs: {
			// Allow serving files from hoisted root node_modules
			allow: ['../..']
		}
	},
	define: {
		'process.env.NODE_ENV': process.env.PUBLIC_ENV === 'dev' ? '"development"' : '"production"'
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: "./src",
			mode: process.env.PUBLIC_ENV === "dev" ? "development" : "production",
			strategies: "injectManifest",
			filename: "custom-sw.ts",
			scope: "/",
			base: "/",
			manifest: {
				short_name: 'LuterGS',
				name: 'LuterGS PWA',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: "#ffffff",
				background_color: "#ffffff"
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/',
			},
			kit: {}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
