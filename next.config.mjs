/** @type {import('next').NextConfig} */
const nextConfig = {
     reactStrictMode: true,
     images: {
          remotePatterns: [
               {
                    hostname: 'res.cloudinary.com',
               },
          ],
     },
     // env: {
     //      API: process.env.API,
     // },
};

export default nextConfig;
