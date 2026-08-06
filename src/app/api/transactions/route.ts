import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');
    const type = searchParams.get('type');

    let query = supabase.from('transactions').select('*, category:categories(*)').order('date', { ascending: false });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (search) {
      query = query.ilike('notes', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ transactions: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          amount: body.amount,
          type: body.type,
          category_id: body.category_id,
          payment_method: body.payment_method || 'cash',
          date: body.date || new Date().toISOString(),
          notes: body.notes,
          currency: body.currency || 'USD',
          is_recurring: body.is_recurring || false,
          recurrence_interval: body.recurrence_interval,
          splits: body.splits,
        },
      ])
      .select('*, category:categories(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ transaction: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save transaction' }, { status: 500 });
  }
}
