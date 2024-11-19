/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'coin-images.coingecko.com',
            port: '',
            pathname: '/coins/images/**',
          },
          {
            protocol: 'https',
            hostname: 'assets.coingecko.com',
            port: '',
            pathname: '/markets/images/**',
          },
          {
            protocol: 'https',
            hostname: 'twa.portfolio.vin',
            port: '',
            pathname: '/**',
          },
        ],
    },
    reactStrictMode: false,
/* 	optimizeFonts: false, */
};

export default nextConfig;
