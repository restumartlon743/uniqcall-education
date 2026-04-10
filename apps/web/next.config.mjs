/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@uniqcall/shared", "@uniqcall/ui"],
};

export default nextConfig;
