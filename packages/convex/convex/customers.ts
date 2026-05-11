import { v } from "convex/values";
import { query } from './_generated/server.js'

export const getByEmail = query({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => await ctx.db.query('customers')
        .filter(q => q.eq(q.field('email'), args.email)).first()
})
