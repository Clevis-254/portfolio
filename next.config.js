/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode catches bugs early
  reactStrictMode: true,

  // Compress responses
  compress: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'github.com' },
    ],
    // Optimise image formats
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://assets.calendly.com https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src https://calendly.com",
              "connect-src 'self' https://api.anthropic.com https://vitals.vercel-insights.com",
              "img-src 'self' data: https:",
            ].join('; '),
          },
        ],
      },
    ]
  },

  
}

module.exports = nextConfig
