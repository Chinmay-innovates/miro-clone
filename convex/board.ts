import { mutation } from "./_generated/server";
import { v } from "convex/values";

const images: string[] = [];

for (let i = 1; i <= 50; i++) {
	images.push(`/placeholders/${i}.svg`);
}

export const create = mutation({
	args: {
		orgId: v.string(),
		title: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const randomImage = images[Math.floor(Math.random() * images.length)];

		const board = await ctx.db.insert("boards", {
			title: args.title,
			orgId: args.orgId,
			authorId: identity.subject,
			authorName: identity.name!,
			imageUrl: randomImage,
		});
		return board;
	},
});