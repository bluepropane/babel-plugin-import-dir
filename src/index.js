const utils = require('./utils');
const pathJoin = require('path').join;
const camelCase = require('lodash.camelcase');

class ImportDeclarationHandler {
  constructor({ path, state, t } = { path: {}, state: {} }) {
    this.setContext(path, state, t);
    this.output = [];
  }

  setContext = (path, state, t) => {
    const { node } = path;
    const context = { path, state, t, node };
    context.cwd = state.file.opts.filename.replace(/(.*)\/[\w-.]+$/, '$1');
    context.targetPattern = pathJoin(context.cwd, node.source.value);
    const moduleInfo = utils
      .getModulesFromPattern(context.targetPattern)
      .map(utils.modulePathToInfo);

    console.log('hi', moduleInfo);

    context.modulePaths = moduleInfo.reduce((accum, { path, name }) => {
      accum[name] = path;
      return accum;
    }, {});

    context.importedModuleIdentifiers = moduleInfo.reduce((accum, { name }) => {
      accum[name] = path.scope.generateUidIdentifier(name);
      return accum;
    }, {});
    this.context = context;
  };

  transformSpecifier = node => {
    let output;
    const { importedModuleIdentifiers, modulePaths, t } = this.context;
    if (this.hasDefaultImportSpecifier) {
      output = t.variableDeclaration('const', [
        t.variableDeclarator(
          t.identifier(node.local.name),
          importedModuleIdentifiers[node.local.name]
        ),
      ]);
    } else {
      output = t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(node.local.name))],
        t.stringLiteral(modulePaths[node.local.name])
      );
    }

    this.output.push(output);
  };

  transformDefaultSpecifier = node => {
    const { importedModuleIdentifiers, modulePaths, t, path } = this.context;
    const targetImports = [];
    const exportedName = node.local.name;
    for (let moduleName in modulePaths) {
      this.output.push(
        t.importDeclaration(
          [t.importDefaultSpecifier(importedModuleIdentifiers[moduleName])],
          t.stringLiteral(modulePaths[moduleName])
        )
      );
    }
  };

  generateDefaultExportObject = () => {
    const { path, importedModuleIdentifiers, t } = this.context;
    const defaultExportObject = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(path.node.specifiers[0].local.name),
        t.objectExpression(
          Object.entries(importedModuleIdentifiers).map(
            ([moduleName, importedModuleId]) => {
              return t.objectProperty(
                t.identifier(camelCase(moduleName)),
                importedModuleId,
                false,
                true
              );
            }
          )
        )
      ),
    ]);
    return defaultExportObject;
  };

  run() {
    const { t, node } = this.context;
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

module.exports = ({ types: t }) => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        if (utils.getFinalPath(node.source.value).includes('*')) {
          const h = new ImportDeclarationHandler({ path, state, t });
          h.run();
          path.replaceWithMultiple(h.output);
        }
      },
    },
  };
};
