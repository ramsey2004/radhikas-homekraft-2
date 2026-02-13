// This file is deprecated - the project uses Prisma instead of MongoDB
// Kept for legacy reference only
// For order operations, use Prisma models defined in prisma/schema.prisma

export interface IOrder {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
