const fs = require('fs');
const pathJoin = require('path').join;
const glob = require('glob');

const MATCH_MODULE_FILES = /\.(js|jsx|ts)$/g;
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

utils.getModulesFromPattern = async function(pattern) {
  const dirs = await new Promise(res => {
    glob(pattern, { mark: true }, (err, matches) => {
      res(matches);
    });
  });
  return dirs
    .filter(mod => MATCH_MODULE_FILES.exec(mod) || mod.endsWith('/'))
    .map(mod => {
      if (mod.endsWith('/')) {
        mod = mod.slice(0, -1);
      } else {
        mod = mod.replace(MATCH_MODULE_FILES, '');
      }
      return mod;
    });
};

utils.getFinalPath = function(path) {
  return path
    .split('/')
    .filter(subPath => subPath !== '')
    .slice(-1);
};

module.exports = utils;
