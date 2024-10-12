import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
  varchar,
} from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccount } from "next-auth/adapters"
import {createId} from '@paralleldrive/cuid2'
import { relations } from "drizzle-orm"

export const RoleEnum = pgEnum("roles",["user", "admin", "cssaStudent"])


export const users = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
  customerID: text("customerID"),
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id").notNull().$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) =>({
    compoundKey: primaryKey({columns:[vt.id, vt.token]}),
  })
)

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text("id").notNull().$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) =>({
    compoundKey: primaryKey({columns:[vt.id, vt.token]}),
  })

)

export const twoFactorTokens = pgTable(
  'two_factor_tokens',
  {
    id: text("id").notNull().$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID:text("userID").references(() => users.id, {onDelete:"cascade"}),
  },
  (vt) =>({
    compoundKey: primaryKey({columns:[vt.id, vt.token]}),
  })

)

//merchant schema
export const merchantSchema = pgTable('merchants',{
  id:serial('id').primaryKey(),
  userId:text('user_id').references(() => users.id,{onDelete:'cascade'})
         .notNull(),
  description:text("description").notNull(),
  title:text("title").notNull(),
  created:timestamp("created").defaultNow(),
  address:text("address").notNull(),
  discountInformation:text("discountInformation").notNull(),
  // merchantType:varchar('merchant_type',{ length: 20 }).notNull(),
}

)

//define the user and merchantSchema relation
export const userMerchantRelation = relations(users,({many})=>({
  merchant:many(merchantSchema)
}))

export const merchantRelations = relations(merchantSchema,({one,many}) =>({
  userId:one(users,{fields:[merchantSchema.userId], references:[users.id]}),
  imageUrl:many(mImages),
  merchantTags:many(tagsTo),
}))

//define Images  table
export const mImages = pgTable('mImages',{
  id:serial('id').primaryKey(),
  merchantId:integer('merchant_id').references(() =>merchantSchema.id,{onDelete:'cascade'})
             .notNull(),
  size:real('size').notNull(),
  imageType:varchar('merchant_type',{ length: 50 }).notNull(),
  order:real('order').notNull(),
  updated:timestamp("created").defaultNow(),
  imageUrl:text('image_url').notNull(),
})

//define the relation between mImages and merchantSchema

export const ImagesToMerchantRelation = relations(mImages,({one}) => ({
  merchantId:one(merchantSchema,{fields:[mImages.merchantId],references:[merchantSchema.id]}),
}))

//define the merchantTags table

export const merchantTags = pgTable('merchantTags',{
  id: integer("id").primaryKey(),
      // 使用 nextval 实现 auto-increment
  tags: varchar('tags', { length: 255 }).notNull(), 
})

//define the third table combine tags and merchantSchema table
export const tagsTo = pgTable('tagsToMerchant',
  {merchantId:integer('merchant_id')
           .notNull()
           .references(() => merchantSchema.id,{onDelete:'cascade'}),
  merchantTagsId:integer('merchantTags_id')
                 .notNull()
                 .references(() => merchantTags.id,{onDelete:'cascade'}),
  },
  (t) =>({
    pk: primaryKey({ columns: [t.merchantId, t.merchantTagsId] }),
  }),
          
)

//define the relations between tags, merchantSchema and tagsToMerchants
// the relation between merchantSchema and tagsToMerchant is on the above
export const tagsRelations = relations(merchantTags,({many})=> ({
  tagsToMerchant:many(tagsTo),
}))

export const tagsAndMerchantRelations = relations(tagsTo,({one}) =>({
  merchantsId:one(merchantSchema,{
            fields:[tagsTo.merchantId],
            references:[merchantSchema.id],
            }),
  tags:one(merchantTags,{
      fields:[tagsTo.merchantTagsId],
      references:[merchantTags.id]
      }),
}))