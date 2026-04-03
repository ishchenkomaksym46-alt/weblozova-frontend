const URL_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export function normalizeArticleImageUrl(value) {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return "";
    }

    if (URL_PROTOCOL_PATTERN.test(trimmedValue)) {
        return trimmedValue;
    }

    if (trimmedValue.startsWith("//")) {
        return `https:${trimmedValue}`;
    }

    if (
        trimmedValue.startsWith("/") ||
        trimmedValue.startsWith("./") ||
        trimmedValue.startsWith("../")
    ) {
        return trimmedValue;
    }

    if (
        trimmedValue.startsWith("localhost") ||
        trimmedValue.startsWith("127.0.0.1")
    ) {
        return `http://${trimmedValue}`;
    }

    return `https://${trimmedValue}`;
}
