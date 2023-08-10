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

    let notiClicked = true;
    pageCurrentClicked.set(Page.NOTIFICATION);
    let subClicked = false;
    let settingClicked = false;
    let notiColor: string;
    let subColor: string;
    let settingColor: string;
    $: {
        notiColor = notiClicked ? "black" : "gray"
        subColor = subClicked ? "black" : "gray"
        settingColor = settingClicked ? "black" : "gray"
    }
    const clickButton = (type: Page) => {
        if (type === Page.NOTIFICATION) { notiClicked = true; subClicked = false; settingClicked = false; }
        if (type === Page.SUBSCRIPTION) { notiClicked = false; subClicked = true; settingClicked = false; }
        if (type === Page.SETTINGS) { notiClicked = false; subClicked = false; settingClicked = true; }
        pageCurrentClicked.set(type);
    }
</script>

<body>
    <Paper override={footerCss}>
        <SimpleGrid cols={3} override={{height: "100%"}}>
            <Button ripple override={buttonCss} on:click={() => {clickButton(Page.NOTIFICATION)}}>
                <Stack align="center" spacing={5}>
                    <Bell size={"1.5rem"} color={notiColor}/>
                    <Text size="sm" color={notiColor}>Notification</Text>
                </Stack>
            </Button>
            <Button ripple override={buttonCss} on:click={() => {clickButton(Page.SUBSCRIPTION)}}>
                <Stack align="center" spacing={5}>
                    <Bookmark size={"1.5rem"} color={subColor}/>
                    <Text size="sm" color={subColor} >Subscription</Text>
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