import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('lang') || '').trim().slice(0, 10);
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id DESC');

    if (!language || language === 'ar') {
      return NextResponse.json(rows);
    }

    const [translationRows] = await pool.query(
      'SELECT category_id, name FROM category_translations WHERE language = ?',
      [language]
    );
    const translations = new Map(
      translationRows.map(row => [Number(row.category_id), row.name])
    );

    return NextResponse.json(rows.map(category => ({
      ...category,
      source_name: category.name,
      name: translations.get(Number(category.id)) || category.name
    })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, image_url } = await request.json();
    const cleanName = String(name || '').trim();
    const imageUrl = String(image_url || '').trim() || null;
    if (!cleanName) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO categories (name, image_url) VALUES (?, ?)',
      [cleanName, imageUrl]
    );
    return NextResponse.json({ id: result.insertId, name: cleanName, image_url: imageUrl }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
