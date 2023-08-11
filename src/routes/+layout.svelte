<script lang="ts">
    import { pwaInfo } from 'virtual:pwa-info';
    import { SvelteUIProvider } from "@svelteuidev/core";
    import Footer from "$lib/component/footer/Footer.svelte";

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<SvelteUIProvider>
    <body class="body">
        <div class="headerAndPage">
            <slot />
        </div>
        <Footer />
    </body>
</SvelteUIProvider>


<style>
    .body {
        display: flex;
        height: 100%;
        background-color: #f2f4f6;
        --ms-overflow-style: none;
        scrollbar-width: none;
    }

    .body::-webkit-scrollbar {
        display: none;
    }

    .headerAndPage {
        display: flex;
        flex: 1 1 auto;
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100% - 1.5rem - 2rem);
        /*width: 100%;*/
        height: calc(91% - 2.25rem - 1.5rem);
        background-color: white;
        border: 0;
        border-radius: 2rem;
        margin: 0.75rem;
        padding: 0 1rem 1rem 1rem;
    }


</style>


