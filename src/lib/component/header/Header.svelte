<script lang="ts">
    import {Center, Paper, Text} from "@svelteuidev/core";
    import {Page, pageCurrentClicked} from "$lib/component/footer/footer";

    const headerCss = {
        display: "block",
        position: "relative",
        top: "0%",
        right: "0%",
        width: "100%",
        backgroundColor: "white",
        margin: "0",
        border: "0",
        padding: "0rem 1rem 1rem 1rem",
        height: "8%",
        boxShadow: "none",
    }

    const centerCss = {
        height: "100%"
    }

    const textCss = {
        fontSize: "1.5rem",
        // width: "100%",
        margin: 0,
        verticalAlign: "middle",
        // padding: "0 0 0 0rem"
    }

    let header;
    pageCurrentClicked.subscribe(value => {
        switch (value) {
            case Page.MESSAGES:
                header = "MESSAGES"
                break;
            case Page.TOPICS:
                header = "TOPICS"
                break;
            case Page.SETTINGS:
                header = "SETTINGS"
                break;
        }
    })
</script>

<body>
    <Paper override={headerCss}>
        <Center override={centerCss}>
            <Text weight={'bold'} override={textCss}>{header}</Text>
        </Center>
    </Paper>
</body>