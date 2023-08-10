/// <reference lib="webworker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import {createPushAlarmFromText} from "./lib/push/PushNotification";
import {notiHistory} from "./lib/component/notification/notiDb";

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        self.skipWaiting()
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
    allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('/'),
    { allowlist },
))

self.addEventListener('push', (e) => {
    e.waitUntil(showNoti(e))
})

async function showNoti(e: PushEvent): Promise<void> {
    const noti = createPushAlarmFromText(e.data.text())
    notiHistory.addNotiPerTopic(noti);
    return self.registration.showNotification(noti.title, {
        body: noti.body
        // icon: noti.icon ?? null
    })
}