'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
          return { success: false, error: result.error };
        }

        toast.success('Logged in successfully');
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        router.push(callbackUrl);
        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        const message = error instanceof Error ? error.message : 'Failed to login';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [router, searchParams]
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signIn('google', { redirect: false });
      if (result?.error) {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
      return { success: false, error: 'Failed to login with Google' };
    }
  }, [router, searchParams]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
  };
}
