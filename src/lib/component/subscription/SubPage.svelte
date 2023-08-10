<script lang="ts">
    import {Button, Group, Loader, Paper, Stack, Text, ThemeIcon} from "@svelteuidev/core";
    import {onMount} from "svelte";
    import {
        getAllTopics,
        getSubscribedTopics,
        subscribeToTopic,
        unsubscribeToTopic
    } from "$lib/push/PushRequests";
    import type {ReqResult} from "$lib/request/Request";
    import {getSubscribedTopicsByInternal} from "$lib/push/PushRequests.js";
    import {Check, CheckCircled} from "radix-icons-svelte";
    import {pushAuthStore} from "$lib/push/PushStore";
    import ClickablePaper from "$lib/ui/ClickablePaper.svelte";

    let topicList: ReqResult;
    // description, name, subscription, uuid
    let subscribedTopicList: ReqResult;
    let isRefreshing = false;
    let isRefreshed = false;
    $: {
        subscribedTopicList = subscribedTopicList;
        topicList = topicList;
    }
    const refreshTopicList = () => {
        return getAllTopics().then(result => {
            // result.data.map
            topicList = result;
            topicList.data = topicList.data.map(d => {
                d.processing = false;
                return d
            });
        })
    }
    onMount(() => {
        refreshTopicList()
    })
    const refreshTopicListByButton = () => {
        isRefreshing = true;
        refreshTopicList().then(() => {
            isRefreshing = false;
            isRefreshed = true;
            setTimeout(() => {
                isRefreshed = false;
            }, 1500)
        });
    }

    pushAuthStore.subscribe(value => {
        getSubscribedTopics(value).then(result => {
            subscribedTopicList = result;
        })
    })
    const isSubscribedTopic = (topicUUID: string) => {
        return subscribedTopicList.data.find(d => topicUUID === d.uuid) != null;
    }

    const subToTopic = (idx: number) => {
        topicList.data[idx].processing = true;
        subscribeToTopic(topicList.data[idx].uuid).then(d => {
            topicList.data[idx].processing = false;
            if (d.isError === false) {
                getSubscribedTopicsByInternal().then(result => {
                    subscribedTopicList = result;
                })
            }
        })
    }
    const unsubToTopic = (idx: number) => {
        topicList.data[idx].processing = true;
        unsubscribeToTopic(topicList.data[idx].uuid).then(d => {
            topicList.data[idx].processing = false;
            if (d.isError === false) {
                getSubscribedTopicsByInternal().then(result => {
                    subscribedTopicList = result;
                })
            }
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
        {#if topicList && subscribedTopicList}
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
                {#each topicList.data as topic, index}
                    <Paper override={listStackCss}>
                        <Group position="apart">
                            <Stack spacing="sm">
                                <Group position="left">
                                    <Text weight={"bold"}>{topic.name}</Text>
                                    {#if isSubscribedTopic(topic.uuid)}
                                        <ThemeIcon variant="white" radius="xs" size="xs">
                                            <CheckCircled />
                                        </ThemeIcon>
                                    {/if}
                                </Group>
                                <Text>{topic.description}</Text>
                            </Stack>
                            {#if isSubscribedTopic(topic.uuid)}
                                <Button disabled={topic.processing} override={unsubscribeButtonCss}>
                                    {#if topic.processing === true}
                                        <Loader color="gray" size="sm"/>
                                    {:else}
                                        <Text color="#C13538" align="center" size="sm"
                                              on:click={() => {unsubToTopic(index)}}>구독 취소</Text>
                                    {/if}
                                </Button>
                            {:else}
                                <Button disabled={topic.processing} override={subscribeButtonCss}>
                                    {#if topic.processing === true}
                                        <Loader color="gray" size="sm"/>
                                    {:else}
                                        <Text color="#4F5867" align="center" size="sm"
                                              on:click={() => {subToTopic(index)}}>구독</Text>
                                    {/if}
                                </Button>
                            {/if}
                        </Group>
                    </Paper>
                {/each}
            </Stack>
        {/if}
    </div>
</body>

<style>
    body {
        padding-top: 1rem;
        height: 100%;
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
</style>