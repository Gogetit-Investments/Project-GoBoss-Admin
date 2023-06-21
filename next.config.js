/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const { i18n } = require('./next-i18next.config');
const withTM = require('next-transpile-modules')(['react-images-upload']);

const nextConfig = {
  reactStrictMode: true,
  i18n,
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },
  basePath: '/admin',
  images: {
    domains: [
      '139.59.176.153',
      'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      '127.0.0.1',
      'localhost',
      'localhost:8000',
      'localhost:3002/admin',
      // '127.0.0.1:8000',
      'picsum.photos',
      'pixarlaravel.s3.ap-southeast-1.amazonaws.com',
      'lh3.googleusercontent.com',
      'backend.goboss.com.ng',
      'ng.jumia.is'
    ],
  },
  ...(process.env.APPLICATION_MODE === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
};

module.exports = withPWA(withTM(nextConfig));
