// This file is deprecated - the project uses Prisma instead of MongoDB
// Kept for legacy reference only
// For product operations, use Prisma models defined in prisma/schema.prisma

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  images: string[];
  material: string;
  dimensions?: string;
  weight?: number;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
}
