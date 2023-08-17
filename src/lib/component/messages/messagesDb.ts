import Dexie, {type Table} from 'dexie';
import type {PushMessage} from "$lib/push/PushMessage";


export class TopicMessagesHistoryDexie extends Dexie {
    pushMessages!: Table<PushMessage>
    readonly limitOfTopicHistory: number = 30

    async addMessagePerTopic(pushNotification: PushMessage): Promise<any> {
        return this.pushMessages
            .where('topic')
            .equals(pushNotification.topic)
            .toArray()
            .then(result => {
                return {
                    size: result.length,
                    first: result.length === 0
                        ? null
                        : result.reduce((a, b) => a.id!! < b.id!! ? a : b)
                }
            })
            .then(result => {
                if (result.size >= this.limitOfTopicHistory) return this.pushMessages.delete(result.first.id)
                else return null;
            }).then(result => {
                return this.pushMessages.add(pushNotification)
            })
    }

    getNotisByTopic(topic: string): Promise<Array<PushMessage>> {
        return this.pushMessages.where('topic').equals(topic).toArray();
    }

    getAllNotis(): Promise<Array<PushMessage>> {
        return this.pushMessages.toArray()
    }

    constructor() {
        super('pushMessages');
        this.version(1).stores({
            pushMessages: '++id, receivedAt, topic' // Primary key and indexed props
        });
    }
}

export const pushMessagesDb = new TopicMessagesHistoryDexie()