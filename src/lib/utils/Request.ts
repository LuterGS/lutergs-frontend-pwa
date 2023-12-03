export const advFetch = async(input: RequestInfo | URL, init?: RequestInit) => {
    const result = await fetch(input, init);
    if (result.status >= 200 && result.status < 300) {
        return result.text()
            .then(text => {
                if (text == null || text == "") {
                    return null;
                } else {
                    return JSON.parse(text)
                }
            })
            .then(jsonOrNull => {
                return new ReqResult(false, null, jsonOrNull)
            })
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