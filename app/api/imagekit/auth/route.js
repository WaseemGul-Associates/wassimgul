import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/dal';
import { getImageKitAuth } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const authParams = getImageKitAuth();
    return NextResponse.json(authParams);
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Unauthorized' }, { status: 401 });
  }
}

