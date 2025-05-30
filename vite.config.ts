import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [tailwindcss(), solidPlugin()],
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        cssCodeSplit: false,
        sourcemap: false,
        rollupOptions: {
            output: {
                minifyInternalExports: false,
            },
        },
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
})
