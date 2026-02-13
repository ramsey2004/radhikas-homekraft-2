// This file is deprecated - the project uses NextAuth.js for authentication
// Kept for legacy reference only
// Use NextAuth configuration from src/lib/auth.ts

export function generateToken(_payload: any): string {
  throw new Error('MongoDB auth deprecated. Use NextAuth.js instead.');
}

export function verifyToken(_token: string): any {
  throw new Error('MongoDB auth deprecated. Use NextAuth.js instead.');
}

export function registerUser(
  _email: string,
  _password: string,
  _firstName: string,
  _lastName: string
): void {
  throw new Error('MongoDB auth deprecated. Use NextAuth.js instead.');
}

export function loginUser(_email: string, _password: string): void {
  throw new Error('MongoDB auth deprecated. Use NextAuth.js instead.');
}

export function logoutUser(): void {
  throw new Error('MongoDB auth deprecated. Use NextAuth.js instead.');
}

