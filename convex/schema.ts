import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    teams: defineTable({
        name: v.string(),
        members: v.array(
            v.object({
                name: v.string(),
            }),
        ),
        score: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    scoreEvents: defineTable({
        teamId: v.id('teams'),
        points: v.number(),
        type: v.union(v.literal('initial'), v.literal('award'), v.literal('correction')),
        note: v.string(),
        previousScore: v.number(),
        newScore: v.number(),
        scoredByEmail: v.string(),
        createdAt: v.number(),
    }).index('by_team_created_at', ['teamId', 'createdAt']),
});
