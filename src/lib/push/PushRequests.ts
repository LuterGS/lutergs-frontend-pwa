import {PUBLIC_BACKEND_SERVER} from "$env/static/public";
import {advFetch} from "$lib/request/Request";
import {pushAuthStore, PushInfo} from "$lib/push/PushStore";


let localPushInfo: PushInfo;
pushAuthStore.subscribe(v => localPushInfo = v);

export const sendSubscriptionToServer = (subscription: PushSubscription) => {

    const key = subscription.getKey ? subscription.getKey("p256dh") : "";
    const auth = subscription.getKey ? subscription.getKey("auth") : "";
    pushAuthStore.set(auth);

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


export const getAllTopics = async() => {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/topic`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


export const getSubscribedTopics = async(pushInfo: PushInfo) => {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/subscription/topic`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': pushInfo.authString()
        }
    })
}

export const getSubscribedTopicsByInternal = async() => {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/subscription/topic`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localPushInfo.authString()
        }
    })
}

export const subscribeToTopic = async(topicUUID: string) => {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/subscribe`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localPushInfo.authString()
        },
        body: JSON.stringify({
            topicUUID: topicUUID
        })
    })
}

export const unsubscribeToTopic = async(topicUUID: string) => {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/unsubscribe`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localPushInfo.authString()
        },
        body: JSON.stringify({
            topicUUID: topicUUID
        })
    })
}

export const newTopicMakeRequest = async(description: string)=> {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/topic/request`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description: description
        })
    })
}


