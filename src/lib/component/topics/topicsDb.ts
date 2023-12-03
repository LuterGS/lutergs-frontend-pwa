import Dexie, {type Table} from "dexie";
import {
    getAllTopics,
    getSubscribedTopics,
    subscribeToTopic, unsubscribeFromTopic
} from "$lib/push/PushRequests";

export enum TopicStatus {
    SUBSCRIBED, UNSUBSCRIBED, ERROR
}

export class Topic {
    readonly uuid: string;
    readonly name: string;
    readonly description: string;
    isSubscribed: TopicStatus;       // true... when nothing

    constructor(rawResponse: any) {
        this.uuid = rawResponse.uuid;
        this.name = rawResponse.name;
        this.description = rawResponse.description;
        this.isSubscribed = TopicStatus.ERROR;
    }
}

export class TopicsDexie extends Dexie {
    topic!: Table<Topic>

    async updateAllTopics(): Promise<boolean> {
        const res = await Promise.all([
            getAllTopics(),
            getSubscribedTopics()
        ]);
        let allTopics: any | undefined;
        let subscribedTopics: any | undefined;
        if (!res[0].isError) {
            allTopics = res[0].data;
        }
        if (!res[1].isError) {
            subscribedTopics = res[1].data;
        }
        const markedAllTopics = allTopics?.map(rawTopic => {
            const topic = new Topic(rawTopic);
            if (subscribedTopics?.find(t => t.uuid === topic.uuid)) {
                topic.isSubscribed = TopicStatus.SUBSCRIBED;
            } else if (subscribedTopics != undefined) {
                topic.isSubscribed = TopicStatus.UNSUBSCRIBED;
            }
            return topic;
        });
        try {
            await this.topic.toCollection().modify((value, ref) => {
                const idx = markedAllTopics?.findIndex(t_1 => t_1.uuid === value.uuid);
                if (idx != undefined && markedAllTopics) {
                    if (idx === -1) {
                        delete ref.value;
                    } else {
                        ref.value = {
                            uuid: value.uuid,
                            name: markedAllTopics[idx].name,
                            description: markedAllTopics[idx].description,
                            isSubscribed: markedAllTopics[idx].isSubscribed,
                            type: markedAllTopics[idx].type
                        };
                        markedAllTopics.splice(idx, 1);
                    }
                }
            });
        } catch {
            false;
        }
        if (markedAllTopics) {
            return this.topic.bulkPut(markedAllTopics)
                .catch(() => {
                    return false;
                })
                .then(() => {
                    return true;
                });
        } else return false;
    }

    async updateSubscribedTopics() {
        const result = await getSubscribedTopics();
        if (!result.isError) {
            this.topic.toCollection().modify((value, ref) => {
                const idx = result.data.findIndex(d => d.uuid === value.uuid);
                if (idx != -1) {
                    ref.value.isSubscribed = TopicStatus.SUBSCRIBED;
                } else {
                    ref.value.isSubscribed = TopicStatus.UNSUBSCRIBED;
                }
            });
        }
    }

    async subscribeToTopic(uuid: string) {
        return subscribeToTopic(uuid)
            .then(() => this.topic
                .where("uuid")
                .equals(uuid)
                .modify(sub => {sub.isSubscribed = TopicStatus.SUBSCRIBED})
            );
    }

    async unsubscribeFromTopic(uuid: string) {
        return unsubscribeFromTopic(uuid)
            .then(() => this.topic
                .where("uuid")
                .equals(uuid)
                .modify(sub => {sub.isSubscribed = TopicStatus.UNSUBSCRIBED})
            );
    }

    constructor() {
        super('topicList');
        this.version(1).stores({
            topic: "uuid, name"
        })
    }
}

export const topicListDb = new TopicsDexie();
