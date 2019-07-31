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

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/spotify-card.js',
    external: ['ms'],
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
];
