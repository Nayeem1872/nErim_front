/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  rewrites: () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.0.108:8002/api/:path*",
        // destination:"http://nerim.aloitconsultants.com/api/:path*",
        // destination:"http://nerimbackend:80/api/:path*"
      },
    ];
  },
};

module.exports = nextConfig;
