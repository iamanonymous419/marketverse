import {
  pgTable,
  serial,
  text,
  date,
  time,
  varchar,
  boolean,
  integer,
  numeric,
  smallint,
  json,
} from 'drizzle-orm/pg-core';

// Define your table
export const newsletterTable = pgTable('newsletter', {
  id: serial('id').primaryKey(), // Auto-incrementing ID
  email: text('email').notNull().unique(), // Email field with uniqueness constraint
  createdAt: date('created_at').defaultNow(), // Date field with default as current timestamp
  time: time('time').defaultNow(), // Date field with default as current timestamp
});

export const sellersTable = pgTable('sellers', {
  id: serial('id'),
  email: varchar('email', { length: 255 }).notNull().primaryKey(),
  uniqueId: varchar('unique_id', { length: 50 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }),
  isSeller: boolean('is_seller').default(true),
});

export const sellersInfoTable = pgTable('sellers_info', {
  id: serial('id').primaryKey(),
  uniqueId: varchar('unique_id', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }),
  username: varchar('username', { length: 50 }).notNull(),
  age: integer('age').notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phoneNo: varchar('phone_no', { length: 10 }).notNull(),
  gender: varchar('gender', { length: 30 }),
  profileImageUrl: varchar('profile_image_url', { length: 255 }),
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: date('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: serial('id'),
  productId: integer('product_id').primaryKey().notNull(), // 5-digit ID
  sellerId: varchar('seller_id').notNull(), // Unique ID for each seller
  sellerEmail: varchar('seller_email').notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(), // Name of the product
  productPrice: integer('product_price').notNull(), // Price of the product
  productDescription: text('product_description').notNull(), // Description of the product
  productImages: varchar('product_images', { length: 255 }).array().notNull(), // Array of product image URLs
});

export const paymentAccount = pgTable('payment_account', {
  id: serial('id'),
  accountUsername: varchar('account_username'),
  accountNumber: numeric('account_number').primaryKey(),
  sellerId: varchar('seller_id').notNull(), // Unique ID for each seller
  sellerEmail: varchar('seller_email').notNull(), // Email of the seller
  // isSeller: boolean('is_seller'), if future use or we check if the user is a seller or need to add this field
});

// here's come's the buyer detail's table's.

export const buyerProfile = pgTable('buyer_profile', {
  id: serial('id'),
  uniqueId: varchar('unique_id', { length: 50 }).notNull().unique(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }),
  username: varchar('username', { length: 50 }).notNull(),
  age: integer('age').notNull(),
  email: varchar('email', { length: 100 }).notNull().primaryKey(),
  phoneNo: varchar('phone_no', { length: 12 }).notNull(),
  gender: varchar('gender', { length: 40 }),
  profileImageUrl: varchar('profile_image_url', { length: 255 }),
  cartItems: json('cart_items').default([]),
  wishlistItems: json('wishlist_items').default([]),
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: date('updated_at').defaultNow().notNull(),
});

export const buyerAddress = pgTable('buyer_address', {
  id: serial('id'),
  email: varchar('email', { length: 100 })
    .notNull()
    .references(() => buyerProfile.email, { onDelete: 'cascade' }),
  addressID: integer('address_id').notNull().unique(),
  isDefault: boolean('is_default').default(false).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  streetName: varchar('street_name', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode').notNull(),
  phoneNo: varchar('phone_no', { length: 12 }).notNull(), // Adjusted to varchar for 12+ digits
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt: date('updated_at').defaultNow().notNull(),
});

export const buyerPayment = pgTable('buyer_payment', {
  id: serial('id'),
  accountUsername: varchar('account_username'),
  accountNumber: numeric('account_number').primaryKey(),
  buyerId: varchar('seller_id').notNull(), // Unique ID for each seller
  buyerEmail: varchar('seller_email')
    .notNull()
    .references(() => buyerProfile.email, { onDelete: 'cascade' }), // Email of the seller
  // isSeller: boolean('is_seller'), if future use or we check if the user is a seller or need to add this field
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.productId, { onDelete: 'cascade' }),
  reviewMessage: text('review_message').notNull(),
  reviewDate: date('review_date').defaultNow(),
  reviewStar: smallint('review_star').notNull(), // Rating out of 5
  profileImageUrl: varchar('profile_image_url', { length: 255 }),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }),
});

export const orders = pgTable('orders', {
  id: serial('id'), // Auto-incrementing ID
  orderId: integer('order_id').notNull().unique().primaryKey(), // Unique integer order ID
  buyerEmail: varchar('buyer_email', { length: 255 }).notNull(),
  sellerEmail: varchar('seller_email', { length: 255 }).notNull(),
  orderAt: date('order_at').defaultNow().notNull(),
  status: text('status', {
    enum: ['decline', 'pending', 'approve', 'cancelled', 'delivered'],
  }).notNull(),
  productId: integer('product_id').notNull(),
  addressID: integer('address_iD').notNull(),
  accountNumber: numeric('account_number').notNull(),
  accountUsername: varchar('account_username'),
  transactionN0: varchar('transaction_no', { length: 255 }),
});
