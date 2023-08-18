
import dayjs from "dayjs";

// refer to : https://developer.mozilla.org/en-US/docs/Web/API/Notification/tag
export class PushMessage {
    readonly id?: number;
    readonly topic: string;
    readonly title: string;
    readonly body: string;
    readonly icon?: string;
    readonly receivedAt: string;

    constructor(text: string) {
        const parsed = JSON.parse(text);
        this.topic = parsed.topic;
        this.title = parsed.title;
        this.body = parsed.body;
        this.icon = parsed.icon ?? undefined;
        this.receivedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }

    isHealthCheck(): boolean {
        return this.topic === "healthCheck";
    }
}
