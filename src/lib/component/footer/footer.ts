import {writable} from "svelte/store";


export enum Page {
    TOPICS,  MESSAGES, SETTINGS,
}

const PageCurrentClicked = () => {
    const { subscribe, set } = writable(Page.TOPICS);

    return {
        subscribe,
        set: (value: Page) => {
            set(value)
        }
    }
}

export const pageCurrentClicked = PageCurrentClicked();

