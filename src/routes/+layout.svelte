<script lang="ts">
    import { pwaInfo } from 'virtual:pwa-info';

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>


<main>
    <slot />
</main>


{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt}}
    <ReloadPrompt />
{/await}
