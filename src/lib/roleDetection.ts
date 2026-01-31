import amplifyAuthService from './amplifyAuth';
import type { User } from '../types';

const decodeJwtPayload = (token?: string | null): Record<string, any> | null => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT payload:', error);
    return null;
  }
};

export const getRoleFromSession = async (): Promise<User['role'] | null> => {
  try {
    const session = await amplifyAuthService.getAuthSession();
    const idToken = session?.tokens?.idToken?.toString();
    const payload = decodeJwtPayload(idToken);

    if (!payload) {
      return null;
    }

    const roleFromToken =
      (payload?.['custom:role'] as User['role'] | undefined) ||
      (payload?.role as User['role'] | undefined) ||
      (Array.isArray(payload?.['cognito:groups']) && payload?.['cognito:groups'].length > 0
        ? (payload?.['cognito:groups']?.[0] as User['role'] | undefined)
        : undefined) ||
      null;

    if (roleFromToken) {
      return roleFromToken;
    }

    const phoneNumber = payload?.phone_number as string | undefined;
    if (phoneNumber) {
      return 'seller';
    }

    return 'user';
  } catch (error) {
    console.error('Failed to resolve role from session:', error);
    return null;
  }
};

export const waitForRoleAny = async (
  expectedRoles: Array<User['role']>,
  maxWaitMs = 3000,
  retryIntervalMs = 100
): Promise<User['role'] | null> => {
  const startTime = Date.now();
  let lastRole: User['role'] | null = null;

  while (Date.now() - startTime < maxWaitMs) {
    const currentRole = await getRoleFromSession();
    if (currentRole) {
      lastRole = currentRole;
    }

    if (currentRole && expectedRoles.includes(currentRole)) {
      return currentRole;
    }

    await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
  }

  return lastRole;
};
