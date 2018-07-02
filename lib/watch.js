const chokidar = require('chokidar');

module.exports = def => {
  const watcher = chokidar.watch(def.files, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  watcher.on('change', path => def.command(path));
};
