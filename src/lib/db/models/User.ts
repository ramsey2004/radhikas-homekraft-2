// This file is deprecated - the project uses Prisma instead of MongoDB
// Kept for legacy reference only
// For user operations, use Prisma models defined in prisma/schema.prisma

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}
