import utils from 'utils';
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
    context.targetDir = pathJoin(
      context.cwd,
      node.source.value.replace('/*', '')
    );
    const moduleInfo = utils
      .getDirs(context.targetDir)
      .map(utils.modulePathToInfo);

    context.modulePaths = moduleInfo.reduce((accum, { path, name }) => {
      accum[name] = path;
      return accum;
    }, {});

    context.importedModuleNames = moduleInfo.reduce((accum, { name }) => {
      accum[name] = camelCase(name);
      return accum;
    }, {});
    this.context = context;
  };

  transformSpecifier = node => {
    let output;
    const { importedModuleNames, modulePaths, t } = this.context;
    if (this.hasDefaultImportSpecifier) {
      output = t.variableDeclaration('const', [
        t.variableDeclarator(
          t.identifier(node.local.name),
          t.identifier(importedModuleNames[node.local.name])
        ),
      ]);
    } else {
      output = t.importDeclaration(
        [
          t.importDefaultSpecifier(
            t.identifier(importedModuleNames[node.local.name])
          ),
        ],
        t.stringLiteral(modulePaths[node.local.name])
      );
    }

    this.output.push(output);
  };

  transformDefaultSpecifier = node => {
    const { importedModuleNames, modulePaths, t } = this.context;
    const targetImports = [];
    const exportedName = node.local.name;
    for (let moduleName in modulePaths) {
      this.context.importedModuleNames[
        moduleName
      ] = `${exportedName}__${importedModuleNames[moduleName]}`;
      this.output.push(
        t.importDeclaration(
          [
            t.importDefaultSpecifier(
              t.identifier(importedModuleNames[moduleName])
            ),
          ],
          t.stringLiteral(modulePaths[moduleName])
        )
      );
    }
  };

  generateDefaultExportObject = () => {
    const { path, importedModuleNames, t } = this.context;
    const defaultExportObject = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(path.node.specifiers[0].local.name),
        t.objectExpression(
          Object.entries(importedModuleNames).map(
            ([moduleName, importedModuleName]) => {
              return t.objectProperty(
                t.identifier(camelCase(moduleName)),
                t.identifier(importedModuleName),
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
