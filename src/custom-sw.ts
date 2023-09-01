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
    e.waitUntil(resolveNotification(e))
})

/**
 * 알림에 대한 iOS 정책 :
 * https://developer.apple.com/documentation/usernotifications/sending_web_push_notifications_in_web_apps_and_browsers
 *
 * Safari doesn’t support invisible push notifications.
 * --> 무조건 알람이 오면 띄워야 하는 것으로 추측됨 (delay 혹은 Not display 같은 행동을 하지 않음)
 * --> healthCheck 는 사용하지 않음.
 *
 * */
const resolveNotification = (ev: PushEvent) => {
    const pushMessage = new PushMessage(ev.data.text())
    self.registration.showNotification(pushMessage.title, {
        body: pushMessage.body,
        icon: pushMessage.icon ?? undefined
    });
    pushMessagesDb.addMessagePerTopic(pushMessage);
    return null;
}