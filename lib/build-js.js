const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');

const rollupConfig = () => {
  const plugins = [
    nodeResolve(),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        'es2015-rollup'
      ]
    })
  ];
  if (process.env.NODE_ENV === 'production') {
    plugins.push(uglify());
  }
  return {
    output: {
      format: 'iife'
    },
    plugins
  };
};

const build = inputFile => {
  const config = Object.assign({}, rollupConfig(), {input: inputFile});
  return rollup.rollup(config)
    .then(bundle => bundle.generate({format: 'iife'}))
    .then(bundle => bundle.code)
  ;
};

module.exports = (files = []) => {
  if (typeof files === 'string') {
    files = [files];
  }
  return Promise.all(files.map(build));
};
