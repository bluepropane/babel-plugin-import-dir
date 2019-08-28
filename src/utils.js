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

utils.getModulesFromPattern = function(pattern, cwd) {
  const dirs = glob.sync(pattern, { mark: true, cwd });
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

utils.prependDotSlash = function(moduleInfo) {
  moduleInfo.forEach(mod => {
    if (!mod.path.startsWith('./')) {
      mod.path = './' + mod.path;
    }
  });
};

module.exports = utils;
