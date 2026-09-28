import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAdmin } from './auth';

export const getTeams = query({
    args: {},
    handler: async (ctx) => {
        const teams = await ctx.db.query('teams').collect();
        return teams.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt);
    },
});

export const getTeam = query({
    args: { teamId: v.id('teams') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.teamId);
    },
});

export const createTeam = mutation({
    args: {
        name: v.string(),
        members: v.array(v.object({ name: v.string() })),
        initialScore: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const admin = await requireAdmin(ctx);

        const name = args.name.trim();
        if (!name) {
            throw new ConvexError('Team name is required.');
        }

        if (args.members.length !== 2) {
            throw new ConvexError('Each team must have exactly 2 members.');
        }

        const initialScore = args.initialScore ?? 0;
        if (!Number.isInteger(initialScore) || initialScore < 0) {
            throw new ConvexError('Starting score must be a non-negative whole number.');
        }

        const memberNames = args.members.map((member) => member.name.trim());
        if (memberNames.some((memberName) => !memberName)) {
            throw new ConvexError('Both team members must have a name.');
        }

        const normalizedName = name.toLowerCase();
        const existingTeam = await ctx.db.query('teams').collect();
        const duplicateName = existingTeam.some(
            (team) => team.name.trim().toLowerCase() === normalizedName,
        );

        if (duplicateName) {
            throw new ConvexError('A team with this name already exists.');
        }

        const now = Date.now();
        const teamId = await ctx.db.insert('teams', {
            name,
            members: memberNames.map((memberName) => ({ name: memberName })),
            score: initialScore,
            createdAt: now,
            updatedAt: now,
        });

        if (initialScore > 0) {
            await ctx.db.insert('scoreEvents', {
                teamId,
                points: initialScore,
                type: 'initial',
                note: 'Preliminary round starting score',
                previousScore: 0,
                newScore: initialScore,
                scoredByEmail: admin.email,
                createdAt: now,
            });
        }

        return teamId;
    },
});

export const deleteTeam = mutation({
    args: { teamId: v.id('teams') },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const team = await ctx.db.get(args.teamId);
        if (!team) {
            throw new Error('Team not found.');
        }

        const events = await ctx.db
            .query('scoreEvents')
            .withIndex('by_team_created_at', (q) => q.eq('teamId', args.teamId))
            .collect();
        for (const event of events) {
            await ctx.db.delete(event._id);
        }
        await ctx.db.delete(args.teamId);
    },
});

export const addPoints = mutation({
    args: {
        teamId: v.id('teams'),
        points: v.number(),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const admin = await requireAdmin(ctx);
        const team = await ctx.db.get(args.teamId);

        if (!team) {
            throw new Error('Team not found.');
        }

        const allowedPoints = [5, 10, -5];
        if (!allowedPoints.includes(args.points)) {
            throw new ConvexError('Choose a preset adjustment of +5, +10, or -5.');
        }

        const trimmedNote = args.note.trim();
        if (trimmedNote.length > 200) {
            throw new Error('Score note is too long.');
        }

        const previousScore = team.score;
        const newScore = previousScore + args.points;
        if (newScore < 0) {
            throw new ConvexError('A team score cannot go below zero.');
        }
        const now = Date.now();

        await ctx.db.patch(args.teamId, {
            score: newScore,
            updatedAt: now,
        });

        await ctx.db.insert('scoreEvents', {
            teamId: args.teamId,
            points: args.points,
            type: 'award',
            note: trimmedNote,
            previousScore,
            newScore,
            scoredByEmail: admin.email,
            createdAt: now,
        });

        return { previousScore, newScore };
    },
});

export const addManualPoints = mutation({
    args: {
        teamId: v.id('teams'),
        points: v.number(),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const admin = await requireAdmin(ctx);
        const team = await ctx.db.get(args.teamId);
        if (!team) {
            throw new Error('Team not found.');
        }
        if (!Number.isInteger(args.points) || args.points < 1 || args.points > 10000) {
            throw new Error('Manual points must be a whole number from 1 to 10000.');
        }

        const note = args.note.trim();
        if (note.length > 200) {
            throw new Error('Score note must be 200 characters or fewer.');
        }

        const previousScore = team.score;
        const newScore = previousScore + args.points;
        const now = Date.now();
        await ctx.db.patch(args.teamId, { score: newScore, updatedAt: now });
        await ctx.db.insert('scoreEvents', {
            teamId: args.teamId,
            points: args.points,
            type: 'award',
            note,
            previousScore,
            newScore,
            scoredByEmail: admin.email,
            createdAt: now,
        });
        return { previousScore, newScore };
    },
});

export const setScore = mutation({
    args: {
        teamId: v.id('teams'),
        score: v.number(),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const admin = await requireAdmin(ctx);
        const team = await ctx.db.get(args.teamId);

        if (!team) {
            throw new Error('Team not found.');
        }

        const trimmedNote = args.note.trim();
        if (trimmedNote.length > 200) {
            throw new Error('Score note is too long.');
        }

        if (!Number.isInteger(args.score) || args.score < 0) {
            throw new Error('Score must be a non-negative whole number.');
        }

        const previousScore = team.score;
        const newScore = args.score;
        const points = newScore - previousScore;
        const now = Date.now();

        await ctx.db.patch(args.teamId, {
            score: newScore,
            updatedAt: now,
        });

        await ctx.db.insert('scoreEvents', {
            teamId: args.teamId,
            points,
            type: 'correction',
            note: trimmedNote,
            previousScore,
            newScore,
            scoredByEmail: admin.email,
            createdAt: now,
        });

        return { previousScore, newScore };
    },
});
