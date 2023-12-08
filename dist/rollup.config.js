'use strict';

module.exports = {
  input: ['./dist/exports.js'],
  output: {
    file: './dist/index.js',
    format: 'es',
  },
  plugins: [[require('@rollup/plugin-commonjs')()]],
};
