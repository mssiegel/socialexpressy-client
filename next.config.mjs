import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // disable Serwist in dev mode as the PWA service worker adds noisy console messages in dev mode
  disable: (process.env.NEXT_PUBLIC_NODE_ENV = "development"),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media*.giphy.com",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
