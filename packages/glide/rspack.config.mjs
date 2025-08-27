import { defineConfig } from '@rspack/cli';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig([
  // CommonJS build
  {
    mode: 'production',
    entry: './src/index.ts',
    output: {
      path: __dirname + '/dist',
      filename: 'index.js',
      library: {
        type: 'commonjs2',
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    optimization: {
      usedExports: true,
      sideEffects: false,
      minimize: true,
    },
    devtool: 'source-map',
  },
  // ESM build
  {
    mode: 'production',
    entry: './src/index.ts',
    output: {
      path: __dirname + '/dist',
      filename: 'index.esm.js',
      library: {
        type: 'module',
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    experiments: {
      outputModule: true,
    },
    optimization: {
      usedExports: true,
      sideEffects: false,
      minimize: true,
    },
    devtool: 'source-map',
  },
]);


