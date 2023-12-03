import {writable} from "svelte/store";
import {convertArrayBufferToString} from "$lib/utils/utilfunc";

export class PushInfo {
    readonly endpoint: string
    private readonly auth: ArrayBuffer | "" | null
    constructor(endpoint: string, auth: ArrayBuffer | "" | null) {
        this.endpoint = endpoint;
        this.auth = auth;
    }

    getAuth(): string {
        return btoa(convertArrayBufferToString(this.auth))
    }
}

const PushEndpointStore = () => {
    const { subscribe, set } = writable(new PushInfo("", null))

    return {
        subscribe,
        set: (endpoint: string, auth: ArrayBuffer | "" | null) => {
            set(new PushInfo(endpoint, auth))
        }
    }
}

export const pushEndpointStore = PushEndpointStore();

const PushGrantedStore = () => {
    const { subscribe, set } = writable("default")

    return {
        subscribe,
        set: (permissionPromise: Promise<NotificationPermission>) => {
            permissionPromise.then(permission => set(permission))
        }
    }
}

export const pushGrantedStore = PushGrantedStore();