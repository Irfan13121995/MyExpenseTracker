import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_CATEGORIES } from '@/lib/utils';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('categories').select('*');

    if (error || !data || data.length === 0) {
      return NextResponse.json({ categories: DEFAULT_CATEGORIES });
    }

    return NextResponse.json({ categories: data });
  } catch {
    return NextResponse.json({ categories: DEFAULT_CATEGORIES });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name: body.name,
          type: body.type,
          icon: body.icon || 'Tag',
          color: body.color || '#3b82f6',
          is_default: false,
        },
      ])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
