import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

// TODO: add node modules bundling https://github.com/kuzivany/simple-preact-rollup/blob/master/rollup.config.js
export default [
  // browser-friendly UMD build
  {
    input: 'src/spotify-card.js',
    output: {
      name: 'spotifyCard',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      // cdn(), // https://github.com/WebReflection/rollup-plugin-cdn
      babel({
        exclude: ['node_modules/**'],
      }),
      terser(),
    ],
  },
];
