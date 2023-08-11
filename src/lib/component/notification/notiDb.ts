import Dexie, {type Table} from 'dexie';
import type {PushNotification} from "$lib/push/PushNotification";


export class NotiHistoryDexie extends Dexie {
    pushNotification!: Table<PushNotification>
    readonly topicMessageLimit: number = 30

    addNotiPerTopic(pushNotification: PushNotification) {
        this.pushNotification
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
                if (result.size >= this.topicMessageLimit) return this.pushNotification.delete(result.first.id)
                else return null;
            }).then(result => {
                return this.pushNotification.add(pushNotification)
            }).then(insertResult => {
                console.log(insertResult)
            })
    }

    getNotisByTopic(topic: string): Promise<Array<PushNotification>> {
        return this.pushNotification.where('topic').equals(topic).toArray();
    }

    getAllNotis(): Promise<Array<PushNotification>> {
        return this.pushNotification.toArray()
    }

    constructor() {
        super('notiHistoryDb');
        this.version(1).stores({
            pushNotification: '++id, receivedAt, topic' // Primary key and indexed props
        });
    }
}

export const notiHistoryDb = new NotiHistoryDexie()