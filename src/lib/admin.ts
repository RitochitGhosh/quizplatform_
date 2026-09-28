export function parseAdminEmails(raw?: string): string[] {
    return (raw ?? '')
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
    const normalizedEmail = email?.trim().toLowerCase();
    const admins = parseAdminEmails(process.env.ADMINEMAILS);
    return Boolean(normalizedEmail && admins.includes(normalizedEmail));
}
