import { v } from 'convex/values';
import { query } from './_generated/server';

export const getScoreHistory = query({
    args: { teamId: v.id('teams') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('scoreEvents')
            .filter((q) => q.eq(q.field('teamId'), args.teamId))
            .order('desc')
            .collect();
    },
});
