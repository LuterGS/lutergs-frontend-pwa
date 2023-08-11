<script lang="ts">
    import {Button, Center, Flex, Group, Loader, Paper, Stack, Text, ThemeIcon} from "@svelteuidev/core";
    import {onMount} from "svelte";
    import {Check, CheckCircled} from "radix-icons-svelte";
    import ClickablePaper from "$lib/ui/ClickablePaper.svelte";
    import {liveQuery} from "dexie";
    import {subListDb, type Subscription} from "$lib/component/subscription/subDb";

    interface ViewSubscriptions extends Subscription {
        processing: boolean;
    }

    let allSubscriptions: ViewSubscriptions[] = []
    let allSubscriptionsRawQuery = liveQuery(
        () => subListDb.subscription.toArray()
    )
    allSubscriptionsRawQuery.subscribe(allSubs => {
        allSubscriptions = allSubs.map(sub => {
            const res: ViewSubscriptions = {
                id: sub.id,
                uuid: sub.uuid,
                name: sub.name,
                description: sub.description,
                isSubscribed: sub.isSubscribed,
                processing: false
            }
            return res;
        }).sort((a, b) => a.id!! < b.id!! ? 1 : -1)
    })
    $: {
        allSubscriptions = allSubscriptions
    }

    let isRefreshing = false;
    let isRefreshed = false;
    onMount(() => {
        subListDb.updateAllSubs();
    })
    const refreshTopicListByButton = () => {
        isRefreshing = true;
        subListDb.updateAllSubs().then((res) => {
            console.log(res);
            isRefreshing = false;
            isRefreshed = true;
            setTimeout(() => {
                isRefreshed = false;
            }, 1500)
        });
    }

    const subscribe = (uuid: string) => {
        const index = allSubscriptions.findIndex(sub => sub.uuid === uuid)
        allSubscriptions[index].processing = true;
        subListDb.subscribeToTopic(uuid).then(() => {
            const index = allSubscriptions.findIndex(sub => sub.uuid === uuid)
            allSubscriptions[index].processing = false;
        })
    }

    const unsubscribe = (uuid: string) => {
        const index = allSubscriptions.findIndex(sub => sub.uuid === uuid)
        allSubscriptions[index].processing = true;
        subListDb.unsubscribeToTopic(uuid).then(() => {
            const index = allSubscriptions.findIndex(sub => sub.uuid === uuid)
            allSubscriptions[index].processing = false;
        })
    }

    const listStackCss = {
        padding: "0.5rem"
    }
    const subscribeButtonCss = {
        padding: "8px",
        border: "0rem",
        width: "4.5rem",
        outline: "0px",
        display: "block",
        color: "black",
        borderRadius: "0.8rem",
        backgroundColor: "#F2F3F4",
        "&:hover": {
            backgroundColor: "#E6E8EB"
        },
    }
    const unsubscribeButtonCss = {
        padding: "8px",
        border: "0rem",
        width: "4.5rem",
        outline: "0px",
        display: "block",
        color: "black",
        borderRadius: "0.8rem",
        backgroundColor: "#F9E8E9",
        "&:hover": {
            backgroundColor: "#FDE4E5"
        },
    }
</script>

<body>
    <div class="scrollableList">
        <Stack spacing="sm">
            <ClickablePaper disabled={isRefreshing || isRefreshed} height="2.6rem"
                            padding="0.5rem" onClick={() => {refreshTopicListByButton()}}>
                {#if isRefreshing === false && isRefreshed === false}
                    <Text align="center">click to Refresh</Text>
                {:else if isRefreshing === true && isRefreshed === false}
                    <Group position="center">
                        <Text>Refreshing...</Text>
                        <Loader color="gray" size={4} />
                    </Group>
                {:else if isRefreshing === false && isRefreshed === true}
                    <Group position="center">
                        <Text>Refreshed!</Text>
                        <Check color="green" size={"1.6rem"} />
                    </Group>
                {/if}
            </ClickablePaper>
            {#each allSubscriptions as subscription}
                <Paper override={listStackCss}>
                    <Flex justify="space-between">
                        <Stack spacing="sm">
                            <Group position="left">
                                <Text weight={"bold"}>{subscription.name}</Text>
                                {#if subscription.isSubscribed}
                                    <ThemeIcon variant="white" radius="xs" size="xs">
                                        <CheckCircled />
                                    </ThemeIcon>
                                {/if}
                            </Group>
                            <Text>{subscription.description}</Text>
                        </Stack>
                        <Center>
                            {#if subscription.isSubscribed}
                                <Button disabled={subscription.processing} override={unsubscribeButtonCss}>
                                    {#if subscription.processing === true}
                                        <Loader color="gray" size="sm"/>
                                    {:else}
                                        <Text color="#C13538" align="center" size="sm"
                                              on:click={() => {unsubscribe(subscription.uuid)}}>구독 취소</Text>
                                    {/if}
                                </Button>
                            {:else}
                                <Button disabled={subscription.processing} override={subscribeButtonCss}>
                                    {#if subscription.processing === true}
                                        <Loader color="gray" size="sm"/>
                                    {:else}
                                        <Text color="#4F5867" align="center" size="sm"
                                              on:click={() => {subscribe(subscription.uuid)}}>구독</Text>
                                    {/if}
                                </Button>
                            {/if}
                        </Center>
                    </Flex>
                </Paper>
        {/each}
        </Stack>
    </div>
</body>

<style>
    body {
        padding-top: 1rem;
        height: 100%;
        margin: 0;
    }

    .scrollableList {
        height: calc(100% - 5rem);
        border: 1px solid #f2f4f6;
        border-radius: 1rem;
        overflow: scroll;
        padding: 0;
        margin: 0;
        --ms-overflow-style: none;
        scrollbar-width: none;
    }

    .scrollableList::-webkit-scrollbar {
        display: none;
    }
</style>