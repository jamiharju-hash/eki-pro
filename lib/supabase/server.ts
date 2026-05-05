import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function requireAdminKey(request: Request) {
  const configured = process.env.EKI_ADMIN_KEY;
  const received = request.headers.get('x-eki-admin-key');

  if (!configured) {
    throw new Error('Missing EKI_ADMIN_KEY');
  }

  if (!received || received !== configured) {
    return false;
  }

  return true;
}
