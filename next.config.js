/** @type {import('next').NextConfig} */
const nextConfig = {
  // Azure Static Web Apps expects a static output folder ("out").
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

