import {PUBLIC_BACKEND_SERVER} from "$env/static/public";
import {advFetch} from "$lib/utils/Request";
import {pushEndpointStore, PushInfo} from "$lib/push/PushStore";
import {convertArrayBufferToString} from "$lib/utils/utilfunc";


let localPushInfo: PushInfo;
pushEndpointStore.subscribe(v => localPushInfo = v);

export const sendSubscriptionToServer = (subscription: PushSubscription) => {
    const key = subscription.getKey ? subscription.getKey("p256dh") : "";
    const auth = subscription.getKey ? subscription.getKey("auth") : "";
    const endpoint = btoa(subscription.endpoint);
    pushEndpointStore.set(endpoint, auth);
    return advFetch(createBaseUrl(endpoint), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key: key ? btoa(convertArrayBufferToString(key)) : '',
            auth: auth ? btoa(convertArrayBufferToString(auth)) : ''
        })
    });
}

export const getAllTopics = async() => {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/topics`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const getSubscribedTopics = async() => {
    return advFetch(`${createBaseUrl()}/topic`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localPushInfo.getAuth()
        }
    })
}

export const subscribeToTopic = async(topicUUID: string) => {
    return advFetch(`${createBaseUrl()}/topic`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localPushInfo.getAuth()
        },
        body: JSON.stringify({
            topicUUID: topicUUID
        })
    })
}

export const unsubscribeFromTopic = async(topicUUID: string) => {
    return advFetch(`${createBaseUrl()}/topic`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localPushInfo.getAuth()
        },
        body: JSON.stringify({
            topicUUID: topicUUID
        })
    })
}

export const newTopicMakeRequest = async(description: string)=> {
    return advFetch(`${PUBLIC_BACKEND_SERVER}/push/suggestion`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description: description
        })
    })
}

const createBaseUrl = (overrideEndpoint?: string) => {
    return `${PUBLIC_BACKEND_SERVER}/push/subscribers/${overrideEndpoint ?? encodeURIComponent(localPushInfo.endpoint)}`
}

