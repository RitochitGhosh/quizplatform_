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
        throw new Error('Unauthenticated');
    }

    const email = identity.email?.trim().toLowerCase();
    const admins = parseAdminEmails(process.env.ADMINEMAILS);

    if (!email) {
        throw new Error(
            'Clerk identity has no email claim. Add an email claim to the Clerk Convex session token.',
        );
    }

    if (!admins.includes(email)) {
        throw new Error('Unauthorized');
    }

    return { identity, email };
}
