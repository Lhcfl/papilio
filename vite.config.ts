import path from 'node:path';
import TailWindCSS from '@tailwindcss/vite';
import TanStackRouter from '@tanstack/router-plugin/vite';
import React from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'react',
        {
          '@tanstack/react-query': [
            'useQuery',
            'useMutation',
            'useQueryClient',
            'useInfiniteQuery',
            'QueryClient',
            'QueryClientProvider',
          ],
          '@tanstack/react-router': ['useNavigate', 'useParams', 'useSearch', 'useRouter'],
          'react-i18next': ['useTranslation'],
        },
      ],
      dts: './src/auto-imports.d.ts',
      dirs: [
        './src/hooks',
        './src/lib',
        './src/services',
        {
          glob: './src/types',
          types: true,
        },
        './src/stores',
        './src/debug',
      ],
      dtsMode: 'overwrite',
    }),
    TailWindCSS(),
    TanStackRouter({
      // autoCodeSplitting: true,
    }),
    React(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
