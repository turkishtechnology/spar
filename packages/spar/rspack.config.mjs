import { defineConfig } from '@rspack/cli';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swcLoaderOptions = {
  jsc: {
    parser: {
      syntax: 'typescript',
      tsx: true,
      decorators: false,
    },
    transform: {
      react: {
        runtime: 'automatic',
        development: false,
        refresh: false,
      },
    },
    target: 'es2020',
    loose: false,
    externalHelpers: false,
    keepClassNames: true,
    preserveAllComments: false,
  },
  minify: false,
  isModule: true,
};

const baseConfig = {
  mode: 'production',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    tsConfig: './tsconfig.json',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: swcLoaderOptions,
          },
        ],
        type: 'javascript/auto',
      },
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  stats: {
    preset: 'normal',
    colors: true,
    timings: true,
    assets: true,
    modules: false,
  },
};

export default defineConfig([
  // CommonJS build
  {
    ...baseConfig,
    output: {
      path: __dirname + '/dist',
      filename: 'index.js',
      library: {
        type: 'commonjs2',
      },
      chunkFormat: 'commonjs',
      environment: {
        module: false,
        dynamicImport: false,
      },
      clean: false,
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'react/jsx-runtime': 'react/jsx-runtime',
      '@floating-ui/react-dom': '@floating-ui/react-dom',
    },
    externalsType: 'commonjs',
    optimization: {
      minimize: true,
      minimizer: [
        {
          apply: (compiler) => {
            const SwcJsMinimizerRspackPlugin =
              compiler.webpack.SwcJsMinimizerRspackPlugin;
            new SwcJsMinimizerRspackPlugin({
              compress: {
                passes: 2,
                dead_code: true,
                drop_console: false,
                drop_debugger: true,
                pure_funcs: [],
              },
              mangle: true,
              format: {
                comments: false,
              },
            }).apply(compiler);
          },
        },
      ],
      usedExports: true,
      sideEffects: false,
      concatenateModules: true,
      providedExports: true,
      innerGraph: true,
    },
    devtool: false,
  },
  // ESM build
  {
    ...baseConfig,
    output: {
      path: __dirname + '/dist',
      filename: 'index.esm.js',
      library: {
        type: 'module',
      },
      chunkFormat: 'module',
      environment: {
        module: true,
        dynamicImport: true,
        const: true,
        arrowFunction: true,
        destructuring: true,
      },
      clean: false,
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'react/jsx-runtime': 'react/jsx-runtime',
      '@floating-ui/react-dom': '@floating-ui/react-dom',
    },
    externalsType: 'module',
    experiments: {
      outputModule: true,
    },
    optimization: {
      minimize: true,
      minimizer: [
        {
          apply: (compiler) => {
            const SwcJsMinimizerRspackPlugin =
              compiler.webpack.SwcJsMinimizerRspackPlugin;
            new SwcJsMinimizerRspackPlugin({
              compress: {
                passes: 2,
                dead_code: true,
                drop_console: false,
                drop_debugger: true,
                pure_funcs: [],
              },
              mangle: true,
              format: {
                comments: false,
              },
            }).apply(compiler);
          },
        },
      ],
      usedExports: true,
      sideEffects: false,
      concatenateModules: true,
      providedExports: true,
      innerGraph: true,
    },
    devtool: false,
  },
]);


