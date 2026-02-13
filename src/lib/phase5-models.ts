/**
 * Phase 5 Database Schema & Models
 * 
 * This file defines the MongoDB schema for all Phase 5 features:
 * - Products and Variants
 * - Orders and Order Items
 * - Reviews and Ratings
 * - Loyalty Accounts and Points
 * - Referral Programs
 * - Email Campaigns
 * - Payment Methods
 * 
 * NOTE: Mongoose integration is optional. This file is for reference purposes.
 * The project uses NextAuth.js with localStorage for cart, orders, and wishlist management.
 */

// import mongoose, { Schema, Document } from 'mongoose';

// ============ PRODUCT SCHEMAS ============

export interface IProduct {
  _id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  material: string;
  dimensions?: string;
  weight?: number;
  careInstructions?: string;
  artisan?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* Mongoose Schema - for future reference when MongoDB is integrated:
const ProductSchema = new Schema(
  {
    sku: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true, index: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    subcategory: String,
    tags: [String],
    images: [String],
    material: String,
    dimensions: String,
    weight: Number,
    careInstructions: String,
    artisan: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// ============ PRODUCT VARIANT SCHEMA ============

export interface IProductVariant extends Document {
  _id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  originalPrice?: number;
  size?: string;
  color?: string;
  material?: string;
  stock: number;
  images: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    sku: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    size: String,
    color: String,
    material: String,
    stock: { type: Number, default: 0, min: 0 },
    images: [String],
    description: String,
  },
  { timestamps: true }
);

// ============ ORDER SCHEMAS ============

export interface IOrderItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, required: true, index: true },
    userId: { type: String, required: true, index: true },
    items: [
      {
        productId: String,
        variantId: String,
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number,
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: String,
    transactionId: String,
    shippingAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    billingAddress: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    trackingNumber: String,
    notes: String,
    deliveredAt: Date,
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

// ============ REVIEW SCHEMA ============

export interface IProductReview extends Document {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  unhelpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userImage: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [String],
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    unhelpful: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, createdAt: -1 });

// ============ LOYALTY SCHEMA ============

export interface ILoyaltyAccount extends Document {
  _id: string;
  userId: string;
  totalPoints: number;
  pointsEarned: number;
  pointsRedeemed: number;
  currentTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierProgress: number;
  lastPointsDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LoyaltyAccountSchema = new Schema(
  {
    userId: { type: String, unique: true, required: true, index: true },
    totalPoints: { type: Number, default: 0, min: 0 },
    pointsEarned: { type: Number, default: 0, min: 0 },
    pointsRedeemed: { type: Number, default: 0, min: 0 },
    currentTier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
      index: true,
    },
    tierProgress: { type: Number, default: 0, min: 0, max: 100 },
    lastPointsDate: Date,
  },
  { timestamps: true }
);

// ============ POINTS TRANSACTION SCHEMA ============

export interface IPointsTransaction extends Document {
  _id: string;
  userId: string;
  points: number;
  type: 'earn' | 'redeem' | 'bonus' | 'adjustment';
  reason: string;
  orderId?: string;
  relatedId?: string;
  createdAt: Date;
}

const PointsTransactionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    points: { type: Number, required: true },
    type: {
      type: String,
      enum: ['earn', 'redeem', 'bonus', 'adjustment'],
      required: true,
      index: true,
    },
    reason: String,
    orderId: { type: String, index: true },
    relatedId: String,
  },
  { timestamps: true }
);

// ============ REFERRAL SCHEMA ============

export interface IReferralProgram extends Document {
  _id: string;
  referrerId: string;
  referralCode: string;
  referralUrl: string;
  totalReferrals: number;
  successfulReferrals: number;
  bonusPoints: number;
  totalEarnings: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ReferralProgramSchema = new Schema(
  {
    referrerId: { type: String, unique: true, required: true, index: true },
    referralCode: { type: String, unique: true, required: true, index: true },
    referralUrl: { type: String, required: true },
    totalReferrals: { type: Number, default: 0 },
    successfulReferrals: { type: Number, default: 0 },
    bonusPoints: { type: Number, default: 500 },
    totalEarnings: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

// ============ EMAIL CAMPAIGN SCHEMA ============

export interface IEmailCampaign extends Document {
  _id: string;
  name: string;
  subject: string;
  templateId: string;
  content: string;
  recipientList: string[];
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  openRate: number;
  clickRate: number;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailCampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    templateId: String,
    content: String,
    recipientList: [String],
    sentCount: { type: Number, default: 0 },
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    conversionCount: { type: Number, default: 0 },
    openRate: { type: Number, default: 0, min: 0, max: 100 },
    clickRate: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent', 'paused'],
      default: 'draft',
      index: true,
    },
    scheduledFor: Date,
    sentAt: Date,
  },
  { timestamps: true }
);

// ============ PAYMENT METHOD SCHEMA ============

export interface IPaymentMethod extends Document {
  _id: string;
  userId: string;
  type: 'card' | 'upi' | 'wallet';
  provider: 'stripe' | 'razorpay';
  token: string;
  last4?: string;
  expiry?: string;
  brand?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['card', 'upi', 'wallet'],
      required: true,
    },
    provider: {
      type: String,
      enum: ['stripe', 'razorpay'],
      required: true,
    },
    token: { type: String, required: true, select: false }, // Don't return token by default
    last4: String,
    expiry: String,
    brand: String,
    isDefault: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

PaymentMethodSchema.index({ userId: 1, isDefault: -1 });

// ============ REFUND SCHEMA ============

export interface IRefund extends Document {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  refundId?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'processing', 'completed', 'rejected'],
      default: 'pending',
      index: true,
    },
    refundId: String,
    provider: String,
  },
  { timestamps: true }
);

// ============ EXPORTS ============

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const ProductVariant = mongoose.models.ProductVariant || mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const Review = mongoose.models.Review || mongoose.model<IProductReview>('Review', ReviewSchema);
export const LoyaltyAccount = mongoose.models.LoyaltyAccount || mongoose.model<ILoyaltyAccount>('LoyaltyAccount', LoyaltyAccountSchema);
export const PointsTransaction = mongoose.models.PointsTransaction || mongoose.model<IPointsTransaction>('PointsTransaction', PointsTransactionSchema);
export const ReferralProgram = mongoose.models.ReferralProgram || mongoose.model<IReferralProgram>('ReferralProgram', ReferralProgramSchema);
export const EmailCampaign = mongoose.models.EmailCampaign || mongoose.model<IEmailCampaign>('EmailCampaign', EmailCampaignSchema);
export const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);
export const Refund = mongoose.models.Refund || mongoose.model<IRefund>('Refund', RefundSchema);
