import Dexie, {type Table} from "dexie";
import {
    getAllTopics,
    getSubscribedTopicsByInternal,
    subscribeToTopic, unsubscribeToTopic
} from "$lib/push/PushRequests";

export interface Subscription {
    readonly id?: number;
    readonly uuid: string;
    readonly name: string;
    readonly description: string;
    isSubscribed: boolean | null;       // true... when nothing
}

export class SubListDexie extends Dexie {
    subscription!: Table<Subscription>

    updateAllSubs(): Promise<boolean> {
        return Promise.all([
            getAllTopics(),
            getSubscribedTopicsByInternal()
        ]).then(res => {
            if (!res[0].isError && !res[1].isError) {
                const allSubs: Subscription[] = res[0].data;
                const subscribedSubs: Subscription[] = res[1].data;
                const markedAllSubs = allSubs.map(sub => {
                    if (subscribedSubs.find(s => s.uuid === sub.uuid)) {
                        sub.isSubscribed = true;
                    }
                    return sub;
                });
                return this.subscription.toCollection().modify((value, ref) => {
                    const newSub = markedAllSubs.find(s => s.uuid === value.uuid);
                    if (newSub === undefined) {
                        delete ref.value;
                    } else {
                        ref.value = {
                            id: value.id,
                            uuid: value.uuid,
                            name: newSub.name,
                            description: newSub.description,
                            isSubscribed: newSub.isSubscribed
                        }
                    }
                }).catch(err => {
                    return false;
                }).then(res => {
                    return true;
                })
            } else {
                return false;
            }
        })
    }

    setSubscribedList() {
        return getSubscribedTopicsByInternal().then(result => {
            const subscribedSubs: Subscription[] = result.data;
            this.subscription.toCollection().modify(sub => {
                sub.isSubscribed = !!subscribedSubs.find(subscribed => subscribed.uuid === sub.uuid);
            })
        })
    }

    subscribeToTopic(uuid: string) {
        return subscribeToTopic(uuid).then(() => {
            return this.subscription
                .where("uuid")
                .equals(uuid)
                .modify(sub => {sub.isSubscribed = true})
        })
    }

    unsubscribeToTopic(uuid: string) {
        return unsubscribeToTopic(uuid).then(() => {
            return this.subscription
                .where('uuid')
                .equals(uuid)
                .modify(sub => {sub.isSubscribed = false})
        })
    }

    constructor() {
        super('subscriptionList');
        this.version(1).stores({
            subscription: "uuid, name"
        })
    }
}

export const subListDb = new SubListDexie();