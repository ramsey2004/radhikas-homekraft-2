// This file is deprecated - the project uses Prisma instead of MongoDB
// Kept for legacy reference only
// For newsletter operations, use Prisma models defined in prisma/schema.prisma

export interface INewsletterSubscription {
  id: string;
  email: string;
  name?: string;
  status: 'subscribed' | 'unsubscribed';
  verificationToken?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
