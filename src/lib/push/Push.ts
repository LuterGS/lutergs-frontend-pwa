
import {PUBLIC_BACKEND_SERVER} from "$env/static/public";

export const sendSubscriptionToServer = (subscription: PushSubscription) => {

    const key = subscription.getKey ? subscription.getKey("p256dh") : "";
    const auth = subscription.getKey ? subscription.getKey("auth") : "";

    return fetch(`${PUBLIC_BACKEND_SERVER}/push/subscription`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: subscription.endpoint,
            key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
            auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
        })
    })
}