<script>
    import {Group, Paper, Stack, Text, ActionIcon, Textarea, Loader, Grid, Center} from "@svelteuidev/core";
    import {Check, PaperPlane, Reload} from "radix-icons-svelte";
    import { useRegisterSW } from 'virtual:pwa-register/svelte';
    import {newTopicMakeRequest} from "$lib/push/PushRequests.ts";

    const {
        offlineReady,
        needRefresh,
        updateServiceWorker
    } = useRegisterSW({
        onRegistered(r) {
            console.log(`SW Registered: ${r}`)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    let newSubTextAreaValue = '';
    let textAreaDisabled = false;
    let showV = false;
    const requestMakeNewTopic = () => {
        textAreaDisabled = true;
        newTopicMakeRequest(newSubTextAreaValue).then(() => {
            textAreaDisabled = false;
            showV = true;
            setTimeout(() => {showV = false}, 1500)
            newSubTextAreaValue = '';
        });
    }


    const close = () => {
        offlineReady.set(false);
        needRefresh.set(false);
    }
    const refreshSW = () => {
        updateServiceWorker(true);
        close();
    }
    let needUpdate = false;
    $: toast = $offlineReady || $needRefresh
    $: {
        if (toast && $offlineReady) {
            close();
            needUpdate = false;
        }
        if (toast && $needRefresh) needUpdate = true;
    }
</script>

<body>
    <Stack spacing="sm">
        <Paper>
            <Grid>
                <Grid.Col span={10}>
                    <Stack spacing="xs">
                        <Text>서비스 워커 리프레시</Text>
                        <Text color="gray" size="xs">UI 를 업데이트할 때 사용합니다. 버튼이 파란색이면 누르세요!</Text>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Center override={{height: "100%"}}>
                        <ActionIcon disabled={!needUpdate} variant="light" color="blue" on:click={() => {refreshSW()}}>
                            <Reload />
                        </ActionIcon>
                    </Center>
                </Grid.Col>
            </Grid>
        </Paper>
        <Paper>
            <Stack>
                <Text>새로운 Subscription 추가 문의</Text>
                <Textarea
                        placeholder="추가하고 싶은 Subscription 을 적어주세요."
                        disabled={textAreaDisabled}
                        rows={5}
                        bind:value={newSubTextAreaValue}
                >
                    <svelte:fragment slot="rightSection">
                        {#if textAreaDisabled === false && showV === false}
                            <ActionIcon on:click={() => {requestMakeNewTopic()}}>
                                <PaperPlane />
                            </ActionIcon>
                        {:else if showV === true}
                            <Check color="green" size="sm" />
                        {:else}
                            <Loader color="blue" size="sm" />
                        {/if}
                    </svelte:fragment>
                </Textarea>
            </Stack>
        </Paper>
    </Stack>
</body>

<style>
    body {
        margin: 0;
    }
</style>