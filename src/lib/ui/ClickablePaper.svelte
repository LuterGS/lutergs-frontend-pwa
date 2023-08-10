<script>
    import {Button, Group} from "@svelteuidev/core";

    export let onClick;
    export let padding = "16px";
    export let border, height;
    export let disabled = false;

    const override = {
        padding: padding,
        border: border,
        outline: "0px",
        display: "block",
        height: height ?? "max-content",
        color: "black",
        textDecoration: "none",
        backgroundColor: "white",
        boxSizing: "border-box",
        borderRadius: "var(--svelteui-radii-sm)",
        "-webkit-tap-highlight-color": "transparent",
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 3px, rgba(0, 0, 0, 0.1) 0px 1px 2px",
        transition: "all 0.2s ease-in-out 0s",
        "&:hover": {
            backgroundColor: "#F1F1F1"
        }
    }
</script>

<Group grow>
    <Button disabled={disabled} ripple
            on:click={onClick}
            override={override}
    >
        <slot>
        </slot>
    </Button>
</Group>