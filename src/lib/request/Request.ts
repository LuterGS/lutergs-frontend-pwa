export const advFetch = async(input: RequestInfo | URL, init?: RequestInit) => {
    const result = await fetch(input, init);
    if (result.status >= 200 && result.status < 300) {
        const body = await result.json();
        return new ReqResult(false, null, body);
    } else {
        let body;
        try {
            body = await result.json();
        } catch (e) {
            body = {error: `status ${result.status}`}
        }
        return new ReqResult(true, body.error, null);
    }
}

export class ReqResult {
    readonly isError: boolean;
    readonly error: string | null;
    data;
    constructor(isError: boolean, error: string | null, data: any) {
        this.isError = isError;
        this.error = error;
        this.data = data;
    }
}