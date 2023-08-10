import {writable} from "svelte/store";


export enum Page {
    NOTIFICATION, SUBSCRIPTION, SETTINGS
}

const PageCurrentClicked = () => {
    const { subscribe, set } = writable(Page.NOTIFICATION);

    return {
        subscribe,
        set: (value: Page) => {
            set(value)
        }
    }
}

export const pageCurrentClicked = PageCurrentClicked();

