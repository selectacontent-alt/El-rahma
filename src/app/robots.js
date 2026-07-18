export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/AdminPage/'],
    },
    sitemap: 'https://elrahma-metal.com/sitemap.xml',
  }
}

