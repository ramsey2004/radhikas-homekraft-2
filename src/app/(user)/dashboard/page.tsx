'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Package, MapPin, Heart, User } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="py-12 text-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold">Welcome, {session?.user?.name || 'Customer'}!</h1>
            <p className="text-gray-600">Manage your account and orders</p>
          </div>
          <button
            onClick={() => signOut({ redirect: false })}
            className="btn btn-outline"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Orders */}
          <Link href={ROUTES.ORDERS} className="card hover:shadow-lg hover:scale-105">
            <div className="mb-4 inline-flex rounded-full bg-amber-100 p-3">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 font-serif font-bold">My Orders</h3>
            <p className="text-sm text-gray-600">Track your orders and purchases</p>
          </Link>

          {/* Addresses */}
          <Link href={ROUTES.ADDRESSES} className="card hover:shadow-lg hover:scale-105">
            <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 font-serif font-bold">Addresses</h3>
            <p className="text-sm text-gray-600">Manage shipping addresses</p>
          </Link>

          {/* Wishlist */}
          <Link href={ROUTES.WISHLIST} className="card hover:shadow-lg hover:scale-105">
            <div className="mb-4 inline-flex rounded-full bg-red-100 p-3">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 font-serif font-bold">Wishlist</h3>
            <p className="text-sm text-gray-600">Your saved items</p>
          </Link>

          {/* Profile */}
          <Link href={ROUTES.PROFILE} className="card hover:shadow-lg hover:scale-105">
            <div className="mb-4 inline-flex rounded-full bg-purple-100 p-3">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mb-2 font-serif font-bold">Profile</h3>
            <p className="text-sm text-gray-600">Edit your information</p>
          </Link>
        </div>

        {/* Quick Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 font-serif text-2xl font-bold">Recent Orders</h2>
            <p className="text-gray-600">No recent orders yet</p>
            <Link href={ROUTES.SHOP} className="btn btn-primary mt-4">
              Start Shopping
            </Link>
          </div>

          {/* Account Info */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 font-serif text-2xl font-bold">Account Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{session?.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{session?.user?.name || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
