import { ConvexError } from 'convex/values';

export function getConvexErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof ConvexError) {
        return typeof error.data === 'string' ? error.data : error.message;
    }

    if (error instanceof Error) {
        const requestId = error.message.match(/Request ID:\s*([\w-]+)/i)?.[1];
        if (requestId) {
            return `${fallback} Please try again. Reference: ${requestId}`;
        }
    }

    return fallback;
}
