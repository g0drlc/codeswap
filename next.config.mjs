import webpack from 'webpack';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Fallback settings using require in ESM
            config.resolve.fallback = {
                fs: false,
                constants: false,
                querystring: false,
                url: false,
                path: false,
                os: false,
                zlib: false,
                http: require.resolve("http-browserify"),
                https: require.resolve("https-browserify"),
                stream: require.resolve("stream-browserify"),
                crypto: require.resolve("crypto-browserify"),
            };

            // ProvidePlugin settings
            config.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser',
                })
            );
        }

        return config;
    },
};

export default nextConfig;
