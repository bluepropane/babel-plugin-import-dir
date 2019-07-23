const fs = require('fs');
const pathJoin = require('path').join;

const utils = {};

utils.modulePathToName = function(modulePath) {
  return [modulePath.split('/').slice(-1)[0], modulePath];
};

utils.modulePathToInfo = function(modulePath) {
  return {
    path: modulePath,
    name: modulePath.split('/').slice(-1)[0],
  };
};

utils.getDirs = function(path) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(dir => pathJoin(path, dir.name));
};

utils.getFinalPath = function(path) {
  return path
    .split('/')
    .filter(subPath => subPath !== '')
    .slice(-1);
};

module.exports = utils;
