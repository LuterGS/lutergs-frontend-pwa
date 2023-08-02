<script lang="ts">

    import {onMount} from "svelte";
    import {Button, Group, Space, Text} from "@svelteuidev/core";

    let lessThan400px = false;
    let status;
    // "default", "denied", "granted"

    // onMount(() => {
    //     Notification.requestPermission().then(result => status = result);
    // })

    const requestPermission = async() => {
        status = await Notification.requestPermission();
    }
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
        <h1>알림 권한을 얻어주세요.</h1>
    {/if}

    <Group position="left">
        <Button on:click={() => requestPermission()}>알람 권한 얻기</Button>
        <Text>{status}</Text>
    </Group>
    <Space h="md"/>
    <Button on:click={() => testNoti()}>알람테스트</Button>
</body>
