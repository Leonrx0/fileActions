import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FileActions',
      fileName: (format) => `file-actions.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        'lodash-es',
        'vuedraggable',
        'vue3-virtual-scroll-list'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          'lodash-es': '_',
          'vuedraggable': 'vuedraggable',
          'vue3-virtual-scroll-list': 'VirtualList'
        },
        exports: 'named'
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  }
});
