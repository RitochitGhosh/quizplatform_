import { ConvexError } from 'convex/values';
import type { MutationCtx, QueryCtx } from './_generated/server';

export function parseAdminEmails(raw: string | undefined): string[] {
    return (raw ?? '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<{
    identity: NonNullable<Awaited<ReturnType<typeof ctx.auth.getUserIdentity>>>;
    email: string;
}> {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new ConvexError('Please sign in before making this change.');
    }

    const email = identity.email?.trim().toLowerCase();
    const admins = parseAdminEmails(process.env.ADMINEMAILS);

    if (!email) {
        throw new ConvexError(
            'Your sign-in token is missing an email address. Check the Clerk Convex JWT template.',
        );
    }

    if (!admins.includes(email)) {
        throw new ConvexError('Your account does not have permission to manage teams.');
    }

    return { identity, email };
}
