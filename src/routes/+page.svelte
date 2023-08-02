<script lang="ts">

    import {onMount} from "svelte";
    import {Button} from "@svelteuidev/core";

    let lessThan400px = false;
    let status = "default";
    // "default", "denied", "granted"

    onMount(() => {
        Notification.requestPermission().then(result => status = result);
    })

    const testNoti = () => {
        console.log("test");
        new Notification("test");
    }

    export let width, height;
    $: {
        lessThan400px = width < 400;
    }
</script>

<body bind:clientWidth={width} bind:clientHeight={height}>
    {#if status === "default"}
        <h1>omg</h1>
    {/if}

    <Button on:click={() => testNoti()}>알람테스트</Button>
</body>
