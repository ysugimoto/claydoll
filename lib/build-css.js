const nodesass = require('node-sass');
const postcss = require('postcss');
const postcssDiscardDuplicates = require('postcss-discard-duplicates');
const autoprefixer = require('autoprefixer');
const csso = require('csso');

const _sass = inputFile => {
  return new Promise((resolve, reject) => {
    nodesass.render({
      file: inputFile,
      includePaths: ['node_modules'],
      outputStyle: 'expanded'
    }, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const _postcss = sassResult => {
  return postcss([postcssDiscardDuplicates, autoprefixer({
    'browsers': [
      '> 1%',
      'last 2 versions',
      'chrome >= 27',
      'opera >= 15',
      'iOS >= 6.1',
      'safari >= 6.1',
      'ie >= 9',
      'ff >= 14'
    ]
  })]).process(sassResult.css, {from: undefined})
  ;
};

const _csso = postcssResult => {
  try {
    const result = csso.minify(postcssResult.css);
    return Promise.resolve(result.css);
  } catch (e) {
    return Promise.reject(e);
  }
};

const build = inputFile => {
  return _sass(inputFile)
    .then(_postcss)
    .then(_csso)
  ;
};

module.exports = (files = []) => {
  if (typeof files === 'string') {
    files = [files];
  }
  return Promise.all(files.map(build));
};
