<script lang="ts">
    import { useRegisterSW } from 'virtual:pwa-register/svelte';
    import AnimatedNotification from "$lib/ui/AnimatedNotification.svelte";
    import {Space, Text} from "@svelteuidev/core";
    import {Reload} from "radix-icons-svelte";

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
    const close = () => {
        offlineReady.set(false)
        needRefresh.set(false)
    }

    let offlineNotiVisible = false;
    const triggerOfflineNotification = () => {
        offlineNotiVisible = true;
        close();
        setTimeout(() => {offlineNotiVisible = false}, 2000)
    }
    let refreshNotiVisible = false;
    const triggerRefreshNotification = () => {
        updateServiceWorker(true);
        close();
    }
    $: toast = $offlineReady || $needRefresh
    $: {
       if (toast && $offlineReady) triggerRefreshNotification() //triggerOfflineNotification();
       if (toast && $needRefresh) refreshNotiVisible = true;
    }
</script>

<body>
    <!-- notification -->
    <AnimatedNotification
        visible={offlineNotiVisible}
        color="blue"
        transition={{x: "3rem", duration: 1000}}
        --top="1rem"
        --right="1rem"
        --width="15rem"
    >
        오프라인 작동이 가능합니다.
    </AnimatedNotification>

    <AnimatedNotification
        visible={refreshNotiVisible}
        color="cyan"
        transition={{x: "3rem", duration: 1000}}
        icon={Reload}
        --top="1rem"
        --right="1rem"
        --width="21rem"
        onClick={() => triggerRefreshNotification()}
    >
        <Text>새로운 콘텐츠 이용이 가능합니다.</Text>
        <Space h="md"/>
        <Text>이 알림을 눌러 업데이트해 주세요</Text>
    </AnimatedNotification>
</body>


