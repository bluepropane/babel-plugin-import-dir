/*
 * Created by liwei.ong on 2019-07-11.
 */
const pathJoin = require('path').join;
const utils = require('./utils');

module.exports = ({ types: t }) => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        if (node.source.value.endsWith('/*')) {
          const expandedImports = [];
          const cwd = state.file.opts.filename.replace(/(.*)\/[\w-.]+$/, '$1');
          const srcDir = node.source.value.replace('/*', '');
          const relativePath = pathJoin(cwd, srcDir);
          const modulePaths = utils.getDirs(pathJoin(cwd, srcDir));

          modulePaths
            .map(utils.modulePathToName)
            .forEach(([moduleName, modulePath]) => {
              expandedImports.push(
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(moduleName))],
                  t.stringLiteral(modulePath)
                )
              );
            });

          const defaultExportObject = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(path.node.specifiers[0].local.name),
              t.objectExpression(
                modulePaths.map(utils.modulePathToName).map(([moduleName]) => {
                  return t.objectProperty(
                    t.stringLiteral(moduleName),
                    t.identifier(moduleName),
                    false,
                    true
                  );
                })
              )
            )
          ]);

          path.replaceWithMultiple(
            expandedImports.concat([defaultExportObject])
          );
        }
      }
    }
  };
};
