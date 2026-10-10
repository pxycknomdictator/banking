import { relations, sql } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    uuid,
    index
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id")
        .default(sql`pg_catalog.gen_random_uuid()`)
        .primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    role: text("role"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
    twoFactorEnabled: boolean("two_factor_enabled").default(false)
});

export const sessions = pgTable(
    "sessions",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        impersonatedBy: text("impersonated_by")
    },
    (table) => [index("sessions_userId_idx").on(table.userId)]
);

export const accounts = pgTable(
    "accounts",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull()
    },
    (table) => [index("accounts_userId_idx").on(table.userId)]
);

export const verifications = pgTable(
    "verifications",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull()
    },
    (table) => [index("verifications_identifier_idx").on(table.identifier)]
);

export const twoFactors = pgTable(
    "two_factors",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        secret: text("secret").notNull(),
        backupCodes: text("backup_codes").notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        verified: boolean("verified").default(true),
        failedVerificationCount: integer("failed_verification_count").default(
            0
        ),
        lockedUntil: timestamp("locked_until")
    },
    (table) => [
        index("twoFactors_secret_idx").on(table.secret),
        index("twoFactors_userId_idx").on(table.userId)
    ]
);

export const passkeys = pgTable(
    "passkeys",
    {
        id: uuid("id")
            .default(sql`pg_catalog.gen_random_uuid()`)
            .primaryKey(),
        name: text("name"),
        publicKey: text("public_key").notNull(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        credentialID: text("credential_id").notNull(),
        counter: integer("counter").notNull(),
        deviceType: text("device_type").notNull(),
        backedUp: boolean("backed_up").notNull(),
        transports: text("transports"),
        createdAt: timestamp("created_at"),
        aaguid: text("aaguid")
    },
    (table) => [
        index("passkeys_userId_idx").on(table.userId),
        index("passkeys_credentialID_idx").on(table.credentialID)
    ]
);

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
    twoFactors: many(twoFactors),
    passkeys: many(passkeys)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}));

export const twoFactorsRelations = relations(twoFactors, ({ one }) => ({
    user: one(users, {
        fields: [twoFactors.userId],
        references: [users.id]
    })
}));

export const passkeysRelations = relations(passkeys, ({ one }) => ({
    user: one(users, {
        fields: [passkeys.userId],
        references: [users.id]
    })
}));
