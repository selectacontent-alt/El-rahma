import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, image_url } = await request.json();
    const cleanName = String(name || '').trim();
    const imageUrl = String(image_url || '').trim() || null;

    if (!cleanName) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const pool = await getPool();
    const [[existing]] = await pool.query('SELECT name FROM categories WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await pool.query(
      'UPDATE categories SET name = ?, image_url = ? WHERE id = ?',
      [cleanName, imageUrl, id]
    );

    if (existing.name !== cleanName) {
      const [productRows] = await pool.query('SELECT id, category, categories FROM products');
      for (const product of productRows) {
        let changed = false;
        const nextPrimary = product.category === existing.name ? cleanName : product.category;
        if (nextPrimary !== product.category) changed = true;

        let nextCategories = null;
        if (product.categories) {
          try {
            const parsed = typeof product.categories === 'string'
              ? JSON.parse(product.categories)
              : product.categories;
            if (Array.isArray(parsed)) {
              nextCategories = parsed.map(item => {
                if (item === existing.name) {
                  changed = true;
                  return cleanName;
                }
                return item;
              });
            }
          } catch (e) {}
        }

        if (changed) {
          await pool.query(
            'UPDATE products SET category = ?, categories = ? WHERE id = ?',
            [nextPrimary, nextCategories ? JSON.stringify(nextCategories) : product.categories, product.id]
          );
        }
      }
    }

    return NextResponse.json({ id: Number(id), name: cleanName, image_url: imageUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    await pool.query('DELETE FROM category_translations WHERE category_id = ?', [id]);
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
