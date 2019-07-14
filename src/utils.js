const fs = require('fs');

function modulePathToName(modulePath) {
  return [modulePath.split('/').slice(-1)[0], modulePath];
}

function getDirs(path) {
  console.log('getting dirs');
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(dir => pathJoin(path, dir.name));
}

module.exports = {
  modulePathToName,
  getDirs
};
