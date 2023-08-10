
import dayjs from "dayjs";

// refer to : https://developer.mozilla.org/en-US/docs/Web/API/Notification/tag
export interface PushNotification {
    readonly id?: number;
    readonly topic: string;    // TODO : backend 구현 필요
    readonly title: string;
    readonly body: string;
    readonly icon?: string;
    readonly receivedAt: string;
}

export const createPushAlarmFromText = (text: string) => {
    const parsed = JSON.parse(text);
    const result: PushNotification = {
        topic: parsed.topic,
        title: parsed.title,
        body: parsed.body,
        icon: parsed.icon ?? undefined,
        receivedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    return result;
}
