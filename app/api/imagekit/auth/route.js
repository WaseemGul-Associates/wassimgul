import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/dal';
import imagekit from '@/lib/imagekit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json({
      ...authParams,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (err) {
    return NextResponse.json({ error: err?.message || 'Unauthorized' }, { status: 401 });
  }
}
