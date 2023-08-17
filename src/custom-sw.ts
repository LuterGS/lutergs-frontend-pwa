/// <reference lib="webworker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import {PushMessage} from "./lib/push/PushMessage";
import {pushMessagesDb} from "./lib/component/messages/messagesDb";

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
    e.waitUntil(showNotification(e))
})

async function showNotification(e: PushEvent): Promise<void> {
    const pushMessage = new PushMessage(e.data.text())
    if (!pushMessage.isHealthCheck()) {
        const waitMilli = pushMessage.showTimestamp - Date.now() > 0
            ? pushMessage.showTimestamp - Date.now()
            : 0
        self.setTimeout(() => {
            self.registration.showNotification(pushMessage.title, {
                body: pushMessage.body,
                icon: pushMessage.icon ?? undefined
            })
            pushMessagesDb.addMessagePerTopic(pushMessage);
        }, waitMilli)
        return Promise.resolve();
    } else {
        console.log("health check message received");
    }
}