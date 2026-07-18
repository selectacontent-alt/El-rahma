import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ط¯ط§ظ„ط© ظ…ط³ط§ط¹ط¯ط© ظ„طھظ†ط¸ظٹظپ ط§ظ„ظ†طµظˆطµ ظˆط­ظ…ط§ظٹطھظ‡ط§ ظ…ظ† ط£ط®ط·ط§ط، ط§ظ„ظ€ XML Syntax
const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return unsafe.toString().replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

export async function GET(request) {
  try {
    const pool = await getPool();
    // ط¬ظ„ط¨ ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظ†ط´ط·ط© ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆطھط±طھظٹط¨ظ‡ط§ ط¨ط§ظ„ط£ط­ط¯ط« (طھظ… طھطµط­ظٹط­ created_at ط¥ظ„ظ‰ id)
    const [products] = await pool.query('SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC');

    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = forwardedHost ? forwardedHost : request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const domain = host ? `${proto}://${host}` : 'https://elrahma-metal.com';
    
    // ط¨ظ†ط§ط، طھط±ظˆظٹط³ط© ظ…ظ„ظپ ط§ظ„ظ€ XML ط§ظ„ظ…طھظˆط§ظپظ‚ط© ظ…ط¹ ظ…ط¹ط§ظٹظٹط± Meta ظˆ Google
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>شركة الرحمة لتشكيل المعادن</title>
    <link>${domain}</link>
    <description>مكونات التأريض والحماية من الصواعق من شركة الرحمة لتشكيل المعادن</description>`;

    // طھظƒط±ط§ط± (Loop) ط¹ظ„ظ‰ ظƒظ„ ظ…ظ†طھط¬ ظ„ط¨ظ†ط§ط، ط§ظ„ظ€ <item> ط§ظ„ط®ط§طµ ط¨ظ‡
    products.forEach((product) => {
      // طھط­ظˆظٹظ„ ط§ظ„ط¹ظ†ظˆط§ظ† ط¥ظ„ظ‰ ط±ط§ط¨ط· طµط¯ظٹظ‚ ظ„ظ…ط­ط±ظƒط§طھ ط§ظ„ط¨ط­ط« ظˆظ…ط·ط§ط¨ظ‚ ظ„ظ…ط¹ظ…ط§ط±ظٹط© طµظپط­ط§طھظƒ
      const productSlug = product.title ? encodeURIComponent(product.title.replace(/\s+/g, '-')) : 'item';
      const link = `${domain}/product/${productSlug}`;
      
      // طھط­ط¯ظٹط¯ ط­ط§ظ„ط© ط§ظ„طھظˆظپط± ط¯ظٹظ†ط§ظ…ظٹظƒظٹظ‹ط§ ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط§ظ„ظ…ط®ط²ظ†
      let isAvailable = true;
      let parsedOpts = {};
      if (product.options) {
        try {
          parsedOpts = typeof product.options === 'string' ? JSON.parse(product.options) : product.options;
        } catch (e) {}
      }

      if (parsedOpts?.variantStock && Object.keys(parsedOpts.variantStock).length > 0) {
        isAvailable = Object.values(parsedOpts.variantStock).some(value => Number(value) > 0);
      } else {
        isAvailable = product.stock === undefined || product.stock === null || Number(product.stock) > 0;
      }
      
      let availability = isAvailable ? 'in stock' : 'out of stock';

      // ظ…ط¹ط§ظ„ط¬ط© ط§ظ„طµظˆط±ط© ط§ظ„ط£ط³ط§ط³ظٹط© ظˆط§ظ„ط¥ط¶ط§ظپظٹط© ظ„ظ„ظ…ظ†طھط¬ (ط³ظˆط§ط، ظƒط§ظ†طھ ظ†طµ ظ…ط¨ط§ط´ط± ط£ظˆ ظ…طµظپظˆظپط© JSON)
      let primaryImage = product.image;
      let displayUrls = [];
      
      if (product.images) {
        try {
          const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
          const productImagesParsed = Array.isArray(parsed) ? parsed : [];
          displayUrls = productImagesParsed.map(img => typeof img === 'object' ? (img.url || img) : img).filter(Boolean);
        } catch(e) {}
      }

      if (!primaryImage) {
        primaryImage = displayUrls.length > 0 ? displayUrls[0] : '';
      }
      
      // ط§ظ„طھط£ظƒط¯ ظ…ظ† ط£ظ† ظ…ط³ط§ط± ط§ظ„طµظˆط±ط© ظƒط§ظ…ظ„ (Absolute URL) ظ„طھط¬ظ†ط¨ ط£ط®ط·ط§ط، Meta
      const formatImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/')) return `${domain}${url}`;
        return url;
      };

      primaryImage = formatImageUrl(primaryImage) || 'https://via.placeholder.com/600?text=El Rahma Factory';

      // طھط¬ظ‡ظٹط² ط§ظ„طµظˆط± ط§ظ„ط¥ط¶ط§ظپظٹط© (ط¨ط­ط¯ ط£ظ‚طµظ‰ 10 طµظˆط± ط¥ط¶ط§ظپظٹط© ط­ط³ط¨ ظ…ط¹ط§ظٹظٹط± ظ…ظٹطھط§)
      let additionalImagesXml = '';
      const additionalUrls = displayUrls.filter(url => formatImageUrl(url) !== primaryImage);
      
      additionalUrls.slice(0, 10).forEach(imgUrl => {
        const formattedImg = formatImageUrl(imgUrl);
        if (formattedImg) {
          additionalImagesXml += `\n      <g:additional_image_link>${escapeXml(formattedImg)}</g:additional_image_link>`;
        }
      });

      // ط­ظ‚ظ† ط¯ط§طھط§ ط§ظ„ظ…ظ†طھط¬ ط¯ط§ط®ظ„ ظ‡ظٹظƒظ„ ظ…ظٹطھط§ ط§ظ„ط±ط³ظ…ظٹ
      xml += `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.description || product.title)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>${additionalImagesXml}
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>`;

      // ط¥ط¶ط§ظپط© ط³ط¹ط± ط§ظ„ط®طµظ… ظپظٹ ط­ط§ظ„ ظˆط¬ظˆط¯ old_price
      if (product.old_price && Number(product.old_price) > Number(product.price)) {
          xml += `
      <g:sale_price>${Number(product.price).toFixed(2)} EGP</g:sale_price>
      <g:price>${Number(product.old_price).toFixed(2)} EGP</g:price>`;
      } else {
          xml += `
      <g:price>${Number(product.price).toFixed(2)} EGP</g:price>`;
      }

      xml += `
      <g:brand>شركة الرحمة</g:brand>
      <g:google_product_category>Hardware &gt; Tools</g:google_product_category>
    </item>`;
    });

    // ط¥ط؛ظ„ط§ظ‚ ظ‚ظ†ظˆط§طھ ط§ظ„ظ€ XML
    xml += `
  </channel>
</rss>`;

    // ط¥ط±ط³ط§ظ„ ط§ظ„ظ…ظ„ظپ ط¨طµظٹط؛ط© XML طµط±ظٹط­ط© ظ…ط¹ ط¹ظ…ظ„ ظƒط§ط´ ظ…ط¤ظ‚طھ ظ„ط­ظ…ط§ظٹط© ط§ظ„ط³ظٹط±ظپط± ظ…ظ† ط§ظ„ط¶ط؛ط·
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

