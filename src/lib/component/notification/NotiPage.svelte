<script lang="ts">
    import {notiHistory} from "$lib/component/notification/notiDb";
    import {liveQuery} from "dexie";
    import {Badge, NativeSelect, Grid, Stack, Text, Space, Paper, Group} from "@svelteuidev/core";
    import {pushGrantedStore} from "$lib/push/PushStore";
    import type {PushNotification} from "$lib/push/PushNotification";

    // logic
    let allNotis: PushNotification[] = [];
    let allTopics: string[] = [];
    let selectedTopic = "all";
    let filteredNotis;
    let rawQuery = liveQuery(
        () => notiHistory.pushNotification.orderBy('receivedAt').reverse().toArray()
    );
    rawQuery.subscribe(pushNotis => {
        allNotis = pushNotis;
        const topics = new Set();
        pushNotis.forEach(noti => topics.add(noti.topic))
        topics.add("all");      // for all topic view handling
        allTopics = Array.from(topics.values());
    })
    $: {
        filteredNotis = allNotis.filter(d => {
            if (selectedTopic === "all") return true;
            else return d.topic === selectedTopic;
        })
    }
    const requestPermission = () => {
        pushGrantedStore.set(Notification.requestPermission())
    }


    // ui
    const badgeCssMap = new Map<string, any>();
    badgeCssMap.set("granted", {color: "blue", text: "GRANTED"})
    badgeCssMap.set("default", {color: "green", text: "DEFAULT"})
    badgeCssMap.set("denied", {color: "red", text: "DENIED"})
    badgeCssMap.set("fallback", {color: "gray", text: "UNKNOWN"})
    const getCssOfBadge = (value: string) => {
        return badgeCssMap.get(value) ? badgeCssMap.get(value) : badgeCssMap.get("fallback")
    }
    let cssBadge;
    pushGrantedStore.subscribe(value => {
        cssBadge = getCssOfBadge(value);
    })
    const textCenterCss1 = {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
        height: "75%"
    }
    const textCenterCss2 = {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
        height: "50%"
    }
    const listStackCss = {
        padding: "0.3rem"
    }

</script>

<body>
    <Stack>
        <Grid>
            <Grid.Col span={5}>
                <Text align="right" override={textCenterCss1}>알림 권한 : </Text>
            </Grid.Col>
            <Grid.Col span={6} offset={1}>
                <Badge on:click={() => {requestPermission()}} color={cssBadge.color}>{cssBadge.text}</Badge>
            </Grid.Col>

            <Grid.Col span={5}>
                <Text align="right" override={textCenterCss2}>토픽 : </Text>
            </Grid.Col>
            <Grid.Col span={6} offset={1}>
                <NativeSelect data={allTopics}
                              placeholder="select Topic to view"
                              bind:value={selectedTopic}
                />
            </Grid.Col>
        </Grid>
    </Stack>
    <Space h="md"/>
    <div class="scrollableList">
        <Stack spacing="xs">
            {#each filteredNotis as noti, index}
                <Paper override={listStackCss}>
                    <Stack spacing="xs">
                        <Group position="apart">
                            <Text color="blue">{noti.topic} - {index + 1}</Text>
                            <Text color="gray" size="xs">at {noti.receivedAt}</Text>
                        </Group>
                        <Text weight={'bold'}>{noti.title}</Text>
                        <Text>{noti.body}</Text>
                    </Stack>
                </Paper>
            {/each}
        </Stack>
    </div>

</body>

<style>
    body {
        height: 100%;
    }

    .scrollableList {
        height: calc(100% - 7rem);
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