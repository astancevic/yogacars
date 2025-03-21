import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from "@astrojs/vercel";

export default defineConfig({
    integrations: [
        react(),
        tailwind({
            // Optional: Configure tailwind options here
            config: { path: './tailwind.config.mjs' },
        }),
    ],
    vite: {
        resolve: {
            alias: {
                // This makes /assets/ work in development
                '/assets': '/public/assets'
            }
        }
    },
    adapter: vercel(),
    output: 'server',
});