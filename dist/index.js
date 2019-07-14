'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const fs = require('fs');

const pathJoin = require('path').join;

const utils = {};

utils.modulePathToName = function (modulePath) {
  return [modulePath.split('/').slice(-1)[0], modulePath];
};

utils.modulePathToInfo = function (modulePath) {
  return {
    path: modulePath,
    name: modulePath.split('/').slice(-1)[0]
  };
};

utils.getDirs = function (path) {
  return fs.readdirSync(path, {
    withFileTypes: true
  }).filter(entry => entry.isDirectory()).map(dir => pathJoin(path, dir.name));
};

utils.getFinalPath = function (path) {
  return path.split('/').filter(subPath => subPath !== '').slice(-1);
};

const pathJoin$1 = require('path').join;

class ImportDeclarationHandler {
  constructor({
    path: _path,
    state: _state,
    t: _t
  } = {
    path: {},
    state: {}
  }) {
    _defineProperty(this, "setContext", (path, state, t) => {
      const {
        node
      } = path;
      const context = {
        path,
        state,
        t,
        node
      };
      context.cwd = state.file.opts.filename.replace(/(.*)\/[\w-.]+$/, '$1');
      context.targetDir = pathJoin$1(context.cwd, node.source.value.replace('/*', ''));
      const moduleInfo = utils.getDirs(pathJoin$1(context.cwd, context.targetDir)).map(utils.modulePathToInfo);
      context.modulePaths = moduleInfo.reduce((accum, {
        path,
        name
      }) => {
        accum[name] = path;
        return accum;
      }, {});
      context.importedModuleNames = moduleInfo.reduce((accum, {
        name
      }) => {
        accum[name] = name;
        return accum;
      }, {});
      this.context = context;
    });

    _defineProperty(this, "transformSpecifier", node => {
      let output;
      const {
        importedModuleNames,
        modulePaths,
        t
      } = this.context;

      if (this.hasDefaultImportSpecifier) {
        output = t.variableDeclaration('const', [t.variableDeclarator(t.identifier(node.local.name), t.identifier(importedModuleNames[node.local.name]))]);
      } else {
        output = t.importDeclaration([t.importDefaultSpecifier(t.identifier(importedModuleNames[node.local.name]))], t.stringLiteral(modulePaths[node.local.name]));
      }

      this.output.push(output);
    });

    _defineProperty(this, "transformDefaultSpecifier", node => {
      const {
        importedModuleNames,
        modulePaths,
        t
      } = this.context;
      const exportedName = node.local.name;

      for (let moduleName in modulePaths) {
        this.context.importedModuleNames[moduleName] = `${exportedName}__${importedModuleNames[moduleName]}`;
        this.output.push(t.importDeclaration([t.importDefaultSpecifier(t.identifier(importedModuleNames[moduleName]))], t.stringLiteral(modulePaths[moduleName])));
      }
    });

    _defineProperty(this, "generateDefaultExportObject", () => {
      const {
        path,
        importedModuleNames,
        t
      } = this.context;
      const defaultExportObject = t.variableDeclaration('const', [t.variableDeclarator(t.identifier(path.node.specifiers[0].local.name), t.objectExpression(Object.entries(importedModuleNames).map(([moduleName, importedModuleName]) => {
        return t.objectProperty(t.identifier(moduleName), t.identifier(importedModuleName), false, true);
      })))]);
      return defaultExportObject;
    });

    this.setContext(_path, _state, _t);
    this.output = [];
  }

  run() {
    const {
      t,
      node
    } = this.context;
    node.specifiers.map(specifierNode => {
      if (t.isImportDefaultSpecifier(specifierNode)) {
        this.hasDefaultImportSpecifier = true;
        this.transformDefaultSpecifier(specifierNode);
      } else if (t.isImportSpecifier(specifierNode)) {
        this.transformSpecifier(specifierNode);
      }
    });

    if (this.hasDefaultImportSpecifier) {
      this.output.push(this.generateDefaultExportObject());
    }
  }

}

module.exports = ({
  types: t
}) => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const {
          node
        } = path;

        if (utils.getFinalPath(node.source.value).includes('*')) {
          const h = new ImportDeclarationHandler({
            path,
            state,
            t
          });
          h.run();
          path.replaceWithMultiple(h.output);
        }
      }

    }
  };
};
