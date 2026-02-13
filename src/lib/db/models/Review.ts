// This file is deprecated - the project uses Prisma instead of MongoDB
// Kept for legacy reference only
// For review operations, use Prisma models defined in prisma/schema.prisma

export interface IReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
