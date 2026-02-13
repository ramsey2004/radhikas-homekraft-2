// This file is deprecated - the project uses Prisma instead of MongoDB
// Kept for legacy reference only
// For database operations, use Prisma client from '@/lib/prisma'

export async function connectDB() {
  throw new Error('MongoDB connection deprecated. Use Prisma instead.');
}
