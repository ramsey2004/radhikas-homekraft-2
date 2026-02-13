/**
 * Advanced Authentication Utilities
 * User profile management, social login setup, token management
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    marketing: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  agreeToTerms: boolean;
}

/**
 * Login with email/password
 */
export async function loginWithEmail(credentials: LoginCredentials): Promise<{
  success: boolean;
  user?: UserProfile;
  token?: AuthToken;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Login failed',
      };
    }

    const data = await response.json();

    // Store token if remember me is checked
    if (credentials.rememberMe && data.token) {
      localStorage.setItem('authToken', data.token.accessToken);
      localStorage.setItem('tokenExpiry', (Date.now() + data.token.expiresIn * 1000).toString());
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Sign up new user
 */
export async function signupUser(data: SignupData): Promise<{
  success: boolean;
  user?: UserProfile;
  token?: AuthToken;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Signup failed',
      };
    }

    const result = await response.json();

    // Auto-login after signup
    if (result.token) {
      localStorage.setItem('authToken', result.token.accessToken);
      localStorage.setItem('tokenExpiry', (Date.now() + result.token.expiresIn * 1000).toString());
    }

    return {
      success: true,
      user: result.user,
      token: result.token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed',
    };
  }
}

/**
 * Social login (Google, GitHub, etc.)
 */
export async function loginWithProvider(provider: 'google' | 'github' | 'facebook', token: string): Promise<{
  success: boolean;
  user?: UserProfile;
  authToken?: AuthToken;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Social login failed',
      };
    }

    const data = await response.json();

    // Store token
    if (data.authToken) {
      localStorage.setItem('authToken', data.authToken.accessToken);
      localStorage.setItem('tokenExpiry', (Date.now() + data.authToken.expiresIn * 1000).toString());
    }

    return {
      success: true,
      user: data.user,
      authToken: data.authToken,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Social login failed',
    };
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('user');

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch {
    // Fail silently
  }
}

/**
 * Get stored auth token
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('authToken');
  const expiry = localStorage.getItem('tokenExpiry');

  // Check if token is expired
  if (token && expiry && Date.now() > parseInt(expiry)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    return null;
  }

  return token;
}

/**
 * Refresh auth token
 */
export async function refreshAuthToken(): Promise<{ success: boolean; token?: AuthToken; error?: string }> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
    });

    if (!response.ok) {
      return { success: false, error: 'Token refresh failed' };
    }

    const data = await response.json();

    // Update stored token
    if (data.token) {
      localStorage.setItem('authToken', data.token.accessToken);
      localStorage.setItem('tokenExpiry', (Date.now() + data.token.expiresIn * 1000).toString());
    }

    return {
      success: true,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token refresh failed',
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<{
  success: boolean;
  user?: UserProfile;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Profile update failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Profile update failed',
    };
  }
}

/**
 * Change password
 */
export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Password change failed',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password change failed',
    };
  }
}

/**
 * Request password reset
 */
export async function requestUserPasswordReset(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Reset request failed',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Reset request failed',
    };
  }
}

/**
 * Reset password with token
 */
export async function resetUserPassword(token: string, newPassword: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Password reset failed',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password reset failed',
    };
  }
}

/**
 * Sync wishlist with server
 */
export async function syncWishlist(items: string[]): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/wishlist/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Wishlist sync failed',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Wishlist sync failed',
    };
  }
}

/**
 * Get wishlist from server
 */
export async function getUserWishlist(): Promise<{
  success: boolean;
  items?: string[];
  error?: string;
}> {
  try {
    const response = await fetch('/api/wishlist', {
      method: 'GET',
    });

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to fetch wishlist',
      };
    }

    const data = await response.json();
    return {
      success: true,
      items: data.items,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wishlist',
    };
  }
}
