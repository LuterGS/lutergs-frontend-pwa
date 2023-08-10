<script lang="ts">
    import {onMount} from "svelte";
    import {PUBLIC_PUSH_KEY} from "$env/static/public";
    import { fly } from "svelte/transition";
    import {sendSubscriptionToServer} from "$lib/push/PushRequests";
    import {Page, pageCurrentClicked} from "$lib/component/footer/footer.js";
    import Header from "$lib/component/header/Header.svelte";
    import NotiPage from "$lib/component/notification/NotiPage.svelte";
    import SubPage from "$lib/component/subscription/SubPage.svelte";
    import SettingPage from "$lib/component/settings/SettingPage.svelte";
    import {pushGrantedStore} from "$lib/push/PushStore";

    let lessThan400px = false;

    onMount(async() => {
        navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
                return serviceWorkerRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: PUBLIC_PUSH_KEY
            })
            .then(subscription => {
                return sendSubscriptionToServer(subscription)
            })
            .catch(exception => {
                if (Notification.permission === 'denied') {
                    console.log("Permission for Notification was denied");
                    alert("Permission for Notification was denied");
                } else {
                    console.error("Unable to subscribe to push", exception);
                    alert(`Unable to subscribe to push : ${exception}`)
                }
            })
        })
        pushGrantedStore.set(Notification.requestPermission());
    })

    // UI
    const transitions = {
        appearLeft: {x: "-3rem", duration: 200},
        appearRight: {x: "3rem", duration: 200},
        disappearLeft: {x: "3rem", duration: 200},
        disappearRight: {x: "-3rem", duration: 200}
    }
    let pageTransitionLink = {
        noti: { t: transitions.appearLeft},
        sub: { t: transitions.appearLeft},
        setting: { t: transitions.appearLeft}
    }
    let currentPage;
    let currentTransition = { t: transitions.appearLeft};
    pageCurrentClicked.subscribe(newPage => {
        // set new Transition
        let newTransition;
        if (newPage === Page.NOTIFICATION) newTransition = pageTransitionLink.noti
        if (newPage === Page.SUBSCRIPTION) newTransition = pageTransitionLink.sub
        if (newPage === Page.SETTINGS) newTransition = pageTransitionLink.setting

        // set transition
        if (newPage > currentPage) {
            currentTransition.t = transitions.disappearLeft;
            newTransition.t = transitions.appearRight;
        } else {
            currentTransition.t = transitions.disappearRight;
            newTransition.t = transitions.appearLeft;
        }
        currentTransition = newTransition;
        currentPage = newPage;
    })

    export let width, height;
    $: {
        lessThan400px = width < 400;
    }
</script>

<body bind:clientWidth={width} bind:clientHeight={height}>
    <div class="main">
        <div class="page">
            {#if currentPage === Page.NOTIFICATION}
                <div transition:fly={pageTransitionLink.noti.t} class="transition">
                    <Header />
                    <NotiPage />
                </div>
            {:else if currentPage === Page.SUBSCRIPTION}
                <div transition:fly={pageTransitionLink.sub.t} class="transition">
                    <Header />
                    <SubPage />
                </div>
            {:else if currentPage === Page.SETTINGS}
                <div transition:fly={pageTransitionLink.setting.t} class="transition">
                    <Header />
                    <SettingPage />
                </div>
            {/if}
        </div>
    </div>
</body>

<style>
    body {
        display: flex;
        width: 100%;
    }

    .main {
        /*display: flex;*/
        flex: 1 1 auto;
        width: 100%;
    }

    .page {
        padding-top: 0.3rem;
        height: 91%;
        position: relative;
    }

    .transition {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
