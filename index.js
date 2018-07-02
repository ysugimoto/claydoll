const _buildJS = require('./lib/build-js.js');
const _buildCSS = require('./lib/build-css.js');
const _watch = require('./lib/watch.js');

const _mapper = files => {
  return bundles => {
    return bundles.reduce((prev, next, index) => {
      prev[files[index]] = next;
      return prev;
    }, {});
  };
};

module.exports = {
  buildJS: (...files) => _buildJS(...files).then(_mapper(files)),
  buildCSS: (...files) => _buildCSS(...files).then(_mapper(files)),
  watch: (...defs) => defs.forEach(_watch)
};
