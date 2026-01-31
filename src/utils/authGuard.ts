/**
 * Simple auth guard utilities
 * No complex verification - just check if user is logged in
 */

/**
 * Check if user is authenticated
 * Redirects to login if not
 */
export const requireLogin = (isLoggedIn: boolean): void => {
  if (!isLoggedIn) {
    window.location.href = '/login';
  }
};

/**
 * Redirect based on role
 * Admin → /admin
 * Seller → /seller/dashboard
 * User → /
 */
export const redirectByRole = (role: string | null): void => {
  if (!role) {
    window.location.href = '/';
    return;
  }

  switch (role) {
    case 'admin':
      window.location.href = '/admin';
      break;
    case 'seller':
      window.location.href = '/seller/dashboard';
      break;
    default:
      window.location.href = '/';
  }
};
