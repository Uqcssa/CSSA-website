import { pgTable, pgEnum, text, timestamp, boolean, foreignKey, serial, integer, varchar, real, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const merchantType = pgEnum("merchant_type", ['清真餐厅', '中餐', '西餐', '甜品', '饮料', '咖啡', '饮品', '烧烤', '火锅', '日料', '韩餐', '留学教育', '生活服务', '休闲娱乐', '线上商家'])
export const roles = pgEnum("roles", ['user', 'admin', 'cssaStudent'])
export const type = pgEnum("type", ['清真餐厅', '中餐', '西餐', '甜品', '饮料', '咖啡', '饮品', '烧烤', '火锅', '日料', '韩餐', '留学教育', '生活服务', '休闲娱乐', '线上商家'])
export const types = pgEnum("types", ['清真餐厅', '中餐', '西餐', '甜品', '饮料', '咖啡', '饮品', '烧烤', '火锅', '日料', '韩餐', '留学教育', '生活服务', '休闲娱乐', '线上商家'])


export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	twoFactorEnabled: boolean("twoFactorEnabled").default(false),
	roles: roles("roles").default('user'),
	password: text("password"),
	customerId: text("customerID"),
});

export const merchants = pgTable("merchants", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	description: text("description").notNull(),
	title: text("title").notNull(),
	created: timestamp("created", { mode: 'string' }).defaultNow(),
	address: text("address").notNull(),
	discountInformation: text("discountInformation").notNull(),
});

export const merchantTags = pgTable("merchantTags", {
	id: integer("id").primaryKey().notNull(),
	tags: varchar("tags", { length: 255 }).notNull(),
});

export const mImages = pgTable("mImages", {
	id: integer("id").primaryKey().notNull(),
	merchantId: integer("merchant_id").notNull().references(() => merchants.id, { onDelete: "cascade" } ),
	imageUrl: text("image_url").notNull(),
	name: text("name").notNull(),
	key: text("key").notNull(),
});

export const events = pgTable("events", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	title: text("title").notNull(),
	description: text("description").notNull(),
	address: text("address").notNull(),
	date: timestamp("date", { mode: 'string' }).notNull(),
	time: text("time").notNull(),
	created: timestamp("created", { mode: 'string' }).defaultNow(),
	status: varchar("status", { length: 20 }).default('active'::character varying),
	maxParticipants: integer("max_participants"),
	currentParticipants: integer("current_participants").default(0),
	price: real("price"),
	organizer: text("organizer").notNull(),
	contactInfo: text("contact_info"),
});

export const eImages = pgTable("eImages", {
	id: serial("id").primaryKey().notNull(),
	eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" } ),
	name: text("name").notNull(),
	key: text("key").notNull(),
	imageUrl: text("image_url").notNull(),
});

export const eventTags = pgTable("eventTags", {
	id: integer("id").primaryKey().notNull(),
	tags: varchar("tags", { length: 255 }).notNull(),
});

export const tagsToMerchant = pgTable("tagsToMerchant", {
	merchantId: integer("merchant_id").notNull().references(() => merchants.id, { onDelete: "cascade" } ),
	merchantTagsId: integer("merchantTags_id").notNull().references(() => merchantTags.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		tagsToMerchantMerchantIdMerchantTagsIdPk: primaryKey({ columns: [table.merchantId, table.merchantTagsId], name: "tagsToMerchant_merchant_id_merchantTags_id_pk"}),
	}
});

export const eventTagsTo = pgTable("eventTagsTo", {
	eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" } ),
	eventTagsId: integer("eventTags_id").notNull().references(() => eventTags.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		eventTagsToEventIdEventTagsIdPk: primaryKey({ columns: [table.eventId, table.eventTagsId], name: "eventTagsTo_event_id_eventTags_id_pk"}),
	}
});

export const emailTokens = pgTable("email_tokens", {
	id: text("id").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
	email: text("email").notNull(),
},
(table) => {
	return {
		emailTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "email_tokens_id_token_pk"}),
	}
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: text("id").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
	email: text("email").notNull(),
},
(table) => {
	return {
		passwordResetTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "password_reset_tokens_id_token_pk"}),
	}
});

export const twoFactorTokens = pgTable("two_factor_tokens", {
	id: text("id").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
	email: text("email").notNull(),
	userId: text("userID").references(() => user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		twoFactorTokensIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "two_factor_tokens_id_token_pk"}),
	}
});

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});