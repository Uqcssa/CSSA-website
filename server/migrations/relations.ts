import { relations } from "drizzle-orm/relations";
import { user, merchants, mImages, events, eImages, tagsToMerchant, merchantTags, eventTagsTo, eventTags, twoFactorTokens, account } from "./schema";

export const merchantsRelations = relations(merchants, ({one, many}) => ({
	user: one(user, {
		fields: [merchants.userId],
		references: [user.id]
	}),
	mImages: many(mImages),
	tagsToMerchants: many(tagsToMerchant),
}));

export const userRelations = relations(user, ({many}) => ({
	merchants: many(merchants),
	events: many(events),
	twoFactorTokens: many(twoFactorTokens),
	accounts: many(account),
}));

export const mImagesRelations = relations(mImages, ({one}) => ({
	merchant: one(merchants, {
		fields: [mImages.merchantId],
		references: [merchants.id]
	}),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	user: one(user, {
		fields: [events.userId],
		references: [user.id]
	}),
	eImages: many(eImages),
	eventTagsTos: many(eventTagsTo),
}));

export const eImagesRelations = relations(eImages, ({one}) => ({
	event: one(events, {
		fields: [eImages.eventId],
		references: [events.id]
	}),
}));

export const tagsToMerchantRelations = relations(tagsToMerchant, ({one}) => ({
	merchant: one(merchants, {
		fields: [tagsToMerchant.merchantId],
		references: [merchants.id]
	}),
	merchantTag: one(merchantTags, {
		fields: [tagsToMerchant.merchantTagsId],
		references: [merchantTags.id]
	}),
}));

export const merchantTagsRelations = relations(merchantTags, ({many}) => ({
	tagsToMerchants: many(tagsToMerchant),
}));

export const eventTagsToRelations = relations(eventTagsTo, ({one}) => ({
	event: one(events, {
		fields: [eventTagsTo.eventId],
		references: [events.id]
	}),
	eventTag: one(eventTags, {
		fields: [eventTagsTo.eventTagsId],
		references: [eventTags.id]
	}),
}));

export const eventTagsRelations = relations(eventTags, ({many}) => ({
	eventTagsTos: many(eventTagsTo),
}));

export const twoFactorTokensRelations = relations(twoFactorTokens, ({one}) => ({
	user: one(user, {
		fields: [twoFactorTokens.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));