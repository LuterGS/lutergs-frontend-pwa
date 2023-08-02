<script lang="ts">
    import { pwaInfo } from 'virtual:pwa-info';
    import { SvelteUIProvider } from "@svelteuidev/core";

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<SvelteUIProvider>
    <slot />
</SvelteUIProvider>

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt}}
    <ReloadPrompt />
{/await}
