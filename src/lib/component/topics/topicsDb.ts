import Dexie, {type Table} from "dexie";
import {
    getAllTopics,
    getSubscribedTopics,
    subscribeToTopic, unsubscribeFromTopic
} from "$lib/push/PushRequests";

export enum TopicStatus {
    SUBSCRIBED, UNSUBSCRIBED, ERROR
}

export enum TopicType {
    FIXED, UNSUBSCRIBABLE, ERROR
}

export class Topic {
    readonly id?: number;
    readonly uuid: string;
    readonly name: string;
    readonly description: string;
    readonly type: TopicType;
    isSubscribed: TopicStatus;       // true... when nothing

    constructor(rawResponse: any) {
        this.uuid = rawResponse.uuid;
        this.name = rawResponse.name;
        this.description = rawResponse.description;
        this.isSubscribed = TopicStatus.ERROR;
        if (rawResponse.type === "FIXED") this.type = TopicType.FIXED
        else if (rawResponse.type === "UNSUBSCRIBABLE") this.type = TopicType.UNSUBSCRIBABLE
        else this.type = TopicType.ERROR;
    }
}

export class TopicsDexie extends Dexie {
    topic!: Table<Topic>

    updateAllTopics(): Promise<boolean> {
        return Promise.all([
            getAllTopics(),
            getSubscribedTopics()
        ]).then(res => {
            let allTopics: any | undefined;
            let subscribedTopics: any | undefined;
            if (!res[0].isError) { allTopics = res[0].data }
            if (!res[1].isError) { subscribedTopics = res[1].data }
            const markedAllTopics = allTopics?.map(rawTopic => {
                const topic = new Topic(rawTopic)
                if (subscribedTopics?.find(t => t.uuid === topic.uuid)) {
                    topic.isSubscribed = TopicStatus.SUBSCRIBED;
                } else if (subscribedTopics != undefined) {
                    topic.isSubscribed = TopicStatus.UNSUBSCRIBED;
                }
                return topic;
            })
            return this.topic.toCollection().modify((value, ref) => {
                const idx = markedAllTopics?.findIndex(t => t.uuid === value.uuid)
                if (idx != undefined && markedAllTopics) {
                    if (idx < -1) { delete ref.value }
                    else {
                        ref.value = {
                            id: value.id,
                            uuid: value.uuid,
                            name: markedAllTopics[idx].name,
                            description: markedAllTopics[idx].description,
                            isSubscribed: markedAllTopics[idx].isSubscribed,
                            type: markedAllTopics[idx].type
                        }
                        markedAllTopics.splice(idx, 1);
                    }
                }
            }).catch(() => {
                return false;
            }).then(() => {
                if (markedAllTopics) {
                    return this.topic.bulkPut(markedAllTopics)
                        .catch(() => {return false})
                        .then(() => {return true})
                } else return false;
            })
        })
    }

    updateSubscribedTopics() {
        return getSubscribedTopics().then(result => {
            if (!result.isError) {
                this.topic.toCollection().modify((value, ref) => {
                    const idx = result.data.findIndex(d => d.uuid === value.uuid)
                    if (idx != -1) { ref.value.isSubscribed = TopicStatus.SUBSCRIBED }
                    else { ref.value.isSubscribed = TopicStatus.UNSUBSCRIBED }
                })
            }
        })
    }

    subscribeToTopic(uuid: string) {
        return subscribeToTopic(uuid).then(() => {
            return this.topic
                .where("uuid")
                .equals(uuid)
                .modify(sub => {sub.isSubscribed = TopicStatus.SUBSCRIBED})
        })
    }

    unsubscribeFromTopic(uuid: string) {
        return unsubscribeFromTopic(uuid).then(() => {
            return this.topic
                .where('uuid')
                .equals(uuid)
                .modify(sub => {sub.isSubscribed = TopicStatus.UNSUBSCRIBED})
        })
    }

    constructor() {
        super('topicList');
        this.version(1).stores({
            topic: "uuid, name"
        })
    }
}

export const topicListDb = new TopicsDexie();
