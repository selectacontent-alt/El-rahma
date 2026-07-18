import App from '../../App';
import { getPool } from '@/lib/db';

const SITE_URL = 'https://elrahma-metal.com';
const SITE_NAME = 'شركة الرحمة لتشكيل المعادن';
const SITE_DESCRIPTION = 'تصنيع وتوريد مكونات التأريض والحماية من الصواعق بجودة صناعية موثوقة.';

const resolveProductImage = (image) => {
  if (!image) return `${SITE_URL}/rahma-logo-full.png`;
  return image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

async function findProductBySlug(pool, slug) {
  const decodedSlug = decodeURIComponent(slug);
  let [rows] = await pool.query(
    'SELECT * FROM products WHERE REPLACE(title, " ", "-") = ? LIMIT 1',
    [decodedSlug]
  );

  if ((!rows || rows.length === 0) && decodedSlug.includes('-')) {
    const lastDash = decodedSlug.lastIndexOf('-');
    const productIdStr = decodedSlug.substring(lastDash + 1);
    [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [productIdStr]);
  }

  return rows?.[0] || null;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  try {
    if (slug[0] === 'product' && slug[1]) {
      const pool = await getPool();
      const product = await findProductBySlug(pool, slug[1]);

      if (product) {
        const imageUrl = resolveProductImage(product.image);
        return {
          title: product.title,
          description: product.description || SITE_DESCRIPTION,
          openGraph: {
            title: product.title,
            description: product.description || SITE_DESCRIPTION,
            images: [{ url: imageUrl, secureUrl: imageUrl, width: 800, height: 800, alt: product.title }],
          },
          twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description || SITE_DESCRIPTION,
            images: [imageUrl],
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }

  return {};
}

export default async function Page(props) {
  const resolvedParams = await props.params;
  const slug = resolvedParams?.slug || [];
  let jsonLd = null;

  try {
    const pool = await getPool();
    if (slug[0] === 'product' && slug[1]) {
      const product = await findProductBySlug(pool, slug[1]);
      if (product) {
        const imageUrl = resolveProductImage(product.image);
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          image: imageUrl,
          description: product.description || SITE_DESCRIPTION,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'EGP',
            availability: (product.stock === undefined || product.stock === null || Number(product.stock) > 0)
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/product/${encodeURIComponent(product.title.replace(/\s+/g, '-'))}`
          }
        };
      }
    } else {
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/rahma-logo-full.png`,
        description: SITE_DESCRIPTION,
      };
    }
  } catch (error) {
    console.error('Error generating JSON-LD:', error);
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <App />
    </>
  );
}
