import nodeExternals from 'webpack-node-externals';

import {fileURLToPath} from "url";
import path from "node:path";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export default {
  entry: {
    main: './src/main.ts',
    server: './src/server.ts',
    proxyWorker: './src/handlers/balancer/proxy.worker.ts'
  },
  target: 'node22',
  mode: 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@handlers': path.resolve(__dirname, 'src/handlers'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@models': path.resolve(__dirname, 'src/models'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
};
