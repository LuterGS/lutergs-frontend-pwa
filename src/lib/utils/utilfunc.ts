const textDecoder = new TextDecoder();

export const convertArrayBufferToString = (value: ArrayBuffer | "" | null) => {
    if (value instanceof ArrayBuffer) {
        return String.fromCharCode.apply(null, new Uint8Array(value))
        // String.fromCharCode(new Uint8Array(value))
        // return textDecoder.decode(new Uint8Array(value));
    } else if (value === "") {
        return "";
    } else {
        return "";
    }
}