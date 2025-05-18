import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import federation from './module-federation.config'
import path from 'path'

export default defineConfig({
    plugins: [federation, tailwindcss(), solidPlugin()],
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
