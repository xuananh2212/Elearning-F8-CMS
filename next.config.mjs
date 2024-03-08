/** @type {import('next').NextConfig} */
const nextConfig = {
     reactStrictMode: true,
     images: {
          domains: ['res.cloudinary.com'],
     },
     // env: {
     //      API: process.env.API,
     // },
};

export default nextConfig;
