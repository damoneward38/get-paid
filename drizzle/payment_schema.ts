/**
 * Payment Processing Schema
 * Stripe and PayPal integration for subscriptions, royalties, and transactions
 */

import { sqliteTable, text, integer, real, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Stripe Customers
export const stripeCustomers = sqliteTable(
  'stripe_customers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().unique(),
    stripeCustomerId: text('stripe_customer_id').notNull().unique(),
    email: text('email').notNull(),
    paymentMethodId: text('payment_method_id'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('stripe_customers_user_id_idx').on(table.userId),
    stripeIdIdx: index('stripe_customers_stripe_id_idx').on(table.stripeCustomerId),
  })
);

// Stripe Subscriptions
export const stripeSubscriptions = sqliteTable(
  'stripe_subscriptions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
    stripeCustomerId: text('stripe_customer_id').notNull(),
    priceId: text('price_id').notNull(),
    status: text('status').notNull(), // 'active', 'past_due', 'canceled', 'unpaid'
    currentPeriodStart: integer('current_period_start').notNull(),
    currentPeriodEnd: integer('current_period_end').notNull(),
    canceledAt: integer('canceled_at'),
    cancelAtPeriodEnd: integer('cancel_at_period_end').default(0).notNull(),
    trialStart: integer('trial_start'),
    trialEnd: integer('trial_end'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('stripe_subscriptions_user_id_idx').on(table.userId),
    stripeIdIdx: index('stripe_subscriptions_stripe_id_idx').on(table.stripeSubscriptionId),
    statusIdx: index('stripe_subscriptions_status_idx').on(table.status),
  })
);

// Stripe Invoices
export const stripeInvoices = sqliteTable(
  'stripe_invoices',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    stripeInvoiceId: text('stripe_invoice_id').notNull().unique(),
    stripeSubscriptionId: text('stripe_subscription_id'),
    amount: real('amount').notNull(),
    currency: text('currency').default('usd').notNull(),
    status: text('status').notNull(), // 'draft', 'open', 'paid', 'void', 'uncollectible'
    paidAt: integer('paid_at'),
    dueDate: integer('due_date'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('stripe_invoices_user_id_idx').on(table.userId),
    stripeIdIdx: index('stripe_invoices_stripe_id_idx').on(table.stripeInvoiceId),
    statusIdx: index('stripe_invoices_status_idx').on(table.status),
  })
);

// PayPal Accounts
export const paypalAccounts = sqliteTable(
  'paypal_accounts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().unique(),
    paypalEmail: text('paypal_email').notNull().unique(),
    paypalMerchantId: text('paypal_merchant_id'),
    status: text('status').default('pending').notNull(), // 'pending', 'verified', 'suspended'
    verifiedAt: integer('verified_at'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('paypal_accounts_user_id_idx').on(table.userId),
    emailIdx: index('paypal_accounts_email_idx').on(table.paypalEmail),
  })
);

// PayPal Payouts
export const paypalPayouts = sqliteTable(
  'paypal_payouts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    payoutBatchId: text('payout_batch_id').notNull().unique(),
    amount: real('amount').notNull(),
    currency: text('currency').default('usd').notNull(),
    status: text('status').notNull(), // 'pending', 'processing', 'success', 'failed', 'canceled'
    recipientEmail: text('recipient_email').notNull(),
    note: text('note'),
    failureReason: text('failure_reason'),
    initiatedAt: integer('initiated_at').notNull(),
    completedAt: integer('completed_at'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('paypal_payouts_user_id_idx').on(table.userId),
    batchIdIdx: index('paypal_payouts_batch_id_idx').on(table.payoutBatchId),
    statusIdx: index('paypal_payouts_status_idx').on(table.status),
  })
);

// Payment Events (Webhook tracking)
export const paymentEvents = sqliteTable(
  'payment_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    eventType: text('event_type').notNull(), // 'charge.succeeded', 'charge.failed', 'customer.subscription.updated', etc
    provider: text('provider').notNull(), // 'stripe', 'paypal'
    externalEventId: text('external_event_id').notNull().unique(),
    userId: integer('user_id'),
    relatedId: text('related_id'), // subscription ID, invoice ID, payout ID, etc
    data: text('data'), // JSON payload
    processed: integer('processed').default(0).notNull(),
    processedAt: integer('processed_at'),
    error: text('error'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('payment_events_user_id_idx').on(table.userId),
    typeIdx: index('payment_events_type_idx').on(table.eventType),
    providerIdx: index('payment_events_provider_idx').on(table.provider),
    externalIdIdx: index('payment_events_external_id_idx').on(table.externalEventId),
    processedIdx: index('payment_events_processed_idx').on(table.processed),
  })
);

// Transaction History
export const transactionHistory = sqliteTable(
  'transaction_history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    type: text('type').notNull(), // 'subscription_charge', 'royalty_payout', 'refund', 'adjustment'
    amount: real('amount').notNull(),
    currency: text('currency').default('usd').notNull(),
    description: text('description'),
    status: text('status').notNull(), // 'pending', 'completed', 'failed'
    provider: text('provider'), // 'stripe', 'paypal'
    externalTransactionId: text('external_transaction_id'),
    relatedEntityId: integer('related_entity_id'), // subscription ID, payout ID, etc
    relatedEntityType: text('related_entity_type'), // 'subscription', 'royalty_payout', etc
    createdAt: integer('created_at').notNull(),
    completedAt: integer('completed_at'),
  },
  (table) => ({
    userIdIdx: index('transaction_history_user_id_idx').on(table.userId),
    typeIdx: index('transaction_history_type_idx').on(table.type),
    statusIdx: index('transaction_history_status_idx').on(table.status),
  })
);

// Billing Cycles
export const billingCycles = sqliteTable(
  'billing_cycles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    subscriptionId: integer('subscription_id'),
    cycleStart: integer('cycle_start').notNull(),
    cycleEnd: integer('cycle_end').notNull(),
    amount: real('amount').notNull(),
    status: text('status').default('pending').notNull(), // 'pending', 'charged', 'failed', 'refunded'
    chargedAt: integer('charged_at'),
    failureCount: integer('failure_count').default(0).notNull(),
    lastFailureReason: text('last_failure_reason'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('billing_cycles_user_id_idx').on(table.userId),
    subscriptionIdIdx: index('billing_cycles_subscription_id_idx').on(table.subscriptionId),
    statusIdx: index('billing_cycles_status_idx').on(table.status),
  })
);

// Relations
export const stripeCustomersRelations = relations(stripeCustomers, ({ one, many }) => ({
  subscriptions: many(stripeSubscriptions),
  invoices: many(stripeInvoices),
}));

export const stripeSubscriptionsRelations = relations(stripeSubscriptions, ({ one, many }) => ({
  customer: one(stripeCustomers, {
    fields: [stripeSubscriptions.stripeCustomerId],
    references: [stripeCustomers.stripeCustomerId],
  }),
  invoices: many(stripeInvoices),
}));

export const paypalAccountsRelations = relations(paypalAccounts, ({ many }) => ({
  payouts: many(paypalPayouts),
}));

export const paypalPayoutsRelations = relations(paypalPayouts, ({ one }) => ({
  account: one(paypalAccounts, {
    fields: [paypalPayouts.userId],
    references: [paypalAccounts.userId],
  }),
}));

export const transactionHistoryRelations = relations(transactionHistory, ({ one }) => ({
  billingCycle: one(billingCycles, {
    fields: [transactionHistory.relatedEntityId],
    references: [billingCycles.id],
  }),
}));
