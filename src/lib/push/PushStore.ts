import {writable} from "svelte/store";

export class PushInfo {
    readonly auth: ArrayBuffer | "" | null
    constructor(auth: ArrayBuffer | "" | null) {
        this.auth = auth;
    }

    authString() {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(this.auth)))
    }
}

const PushAuthStore = () => {
    const { subscribe, set } = writable(new PushInfo(null))

    return {
        subscribe,
        set: (auth: ArrayBuffer | "" | null) => {
            set(new PushInfo(auth))
        }
    }
}

export const pushAuthStore = PushAuthStore();

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