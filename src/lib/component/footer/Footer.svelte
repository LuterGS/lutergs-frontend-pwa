<script lang="ts">
    import {Button, Paper, SimpleGrid, Stack, Text} from "@svelteuidev/core";
    import {Bell, Bookmark, Gear} from "radix-icons-svelte";
    import {Page, pageCurrentClicked} from "$lib/component/footer/footer.js";

    const footerCss = {
        display: "block",
        position: "fixed",
        bottom: "0%",
        right: "0%",
        backgroundColor: "white",
        width: "calc(100% - 1.5rem)",
        padding: "0.5rem",
        height: "9%",
        borderRadius: "2rem",
        boxShadow: "none",
        margin: "0.75rem"
    }

    const buttonCss = {
        padding: "0rem",
        border: "0rem",
        outline: "0px",
        display: "block",
        height: "100%",
        color: "black",
        width: "100%",
        textDecoration: "none",
        backgroundColor: "white",
        boxSizing: "border-box",
        borderRadius: "2rem",
        "-webkit-tap-highlight-color": "transparent",
        // boxShadow: "none",
        transition: "all 0.2s ease-in-out 0s",
        "&:hover": {
            backgroundColor: "#F1F1F1"
        },
        "&:active": {
            transform: "scale(0.89)"
        }
    }

    let topicsClicked = true;
    let messagesClicked = false;
    let settingClicked = false;
    let topicsColor: string;
    let messagesColor: string;
    let settingColor: string;
    $: {
        messagesColor = messagesClicked ? "black" : "gray"
        topicsColor = topicsClicked ? "black" : "gray"
        settingColor = settingClicked ? "black" : "gray"
    }
    const clickButton = (type: Page) => {
        if (type === Page.MESSAGES) { messagesClicked = true; topicsClicked = false; settingClicked = false; }
        if (type === Page.TOPICS) { messagesClicked = false; topicsClicked = true; settingClicked = false; }
        if (type === Page.SETTINGS) { messagesClicked = false; topicsClicked = false; settingClicked = true; }
        pageCurrentClicked.set(type);
    }
</script>

<body>
    <Paper override={footerCss}>
        <SimpleGrid cols={3} override={{height: "100%"}}>
            <Button ripple override={buttonCss} on:click={() => {clickButton(Page.TOPICS)}}>
                <Stack align="center" spacing={5}>
                    <Bookmark size={"1.5rem"} color={topicsColor}/>
                    <Text size="sm" color={topicsColor} >Topics</Text>
                </Stack>
            </Button>
            <Button ripple override={buttonCss} on:click={() => {clickButton(Page.MESSAGES)}}>
                <Stack align="center" spacing={5}>
                    <Bell size={"1.5rem"} color={messagesColor}/>
                    <Text size="sm" color={messagesColor}>Messages</Text>
                </Stack>
            </Button>
            <Button ripple override={buttonCss} on:click={() => {clickButton(Page.SETTINGS)}}>
                <Stack align="center" spacing={5}>
                    <Gear size={"1.5rem"} color={settingColor}/>
                    <Text size="sm" color={settingColor}>Settings</Text>
                </Stack>
            </Button>
        </SimpleGrid>
    </Paper>
</body>

<style>

</style>