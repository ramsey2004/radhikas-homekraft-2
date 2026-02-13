// This file is deprecated - the project uses Prisma instead of MongoDB
// Kept for legacy reference only
// For cart operations, use Prisma models defined in prisma/schema.prisma

export interface ICart {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    addedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
