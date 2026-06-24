import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This project sits next to an unrelated lockfile in the home dir;
  // pin the tracing root so Next stops warning / guessing.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
