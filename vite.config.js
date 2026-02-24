import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Base path for GitHub Pages (https://rinconcito-animal.github.io/store/)
    base: '/',
    // base: '/store/',

    build: {
        // Output to 'docs' folder for GitHub Pages compatibility
        outDir: 'docs',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                shop: resolve(__dirname, 'shop.html'),
                account: resolve(__dirname, 'account.html'),
                login: resolve(__dirname, 'login.html'),
                signup: resolve(__dirname, 'signup.html')

            }
        }
    }
});
