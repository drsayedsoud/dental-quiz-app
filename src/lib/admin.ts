// Single source of truth for "who is an admin" — was previously duplicated as the
// literal string 'drsayedsoudnew@gmail.com' across firestore.ts, AuthContext.tsx,
// dashboard/page.tsx and admin/page.tsx, which made it easy for one copy to drift.
export const ADMIN_EMAIL = 'drsayedsoudnew@gmail.com';

export function isAdminUser(info: { email?: string | null; role?: string | null }): boolean {
  return info.role === 'admin' || info.email === ADMIN_EMAIL;
}
