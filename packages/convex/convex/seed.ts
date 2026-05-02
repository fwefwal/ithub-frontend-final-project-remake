import { internalMutation } from "./_generated/server";

export const seedData = internalMutation(async (ctx) => {
  for (let i = 0; i < 200; i++) {
    await ctx.db.insert("brands", {
      title: "",
    });
  }
});
