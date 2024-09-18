import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    pgEnum,
    serial,
  } from "drizzle-orm/pg-core"
  import { drizzle } from "drizzle-orm/postgres-js"
  import type { AdapterAccount } from "next-auth/adapters"
  import {createId} from '@paralleldrive/cuid2'

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
    description:text("description").notNull(),
    title:text("title").notNull(),
    created:timestamp("created").defaultNow(),
    address:text("address").notNull(),
    discountInformation:text("discountInformation").notNull(),
  }

  )
  