"use strict";function _defineProperty(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}const utils=require("./utils"),pathJoin=require("path").join,camelCase=require("lodash.camelcase");class ImportDeclarationHandler{constructor({path:e,state:t,t:i}={path:{},state:{}}){_defineProperty(this,"setContext",(e,t,i)=>{const{node:r}=e,a={path:e,state:t,t:i,node:r};a.cwd=t.file.opts.filename.replace(/(.*)\/[\w-.]+$/,"$1"),a.targetDir=pathJoin(a.cwd,r.source.value.replace("/*",""));const o=utils.getDirs(a.targetDir).map(utils.modulePathToInfo);a.modulePaths=o.reduce((e,{path:t,name:i})=>(e[i]=t,e),{}),a.importedModuleIdentifiers=o.reduce((t,{name:i})=>(t[i]=e.scope.generateUidIdentifier(i),t),{}),this.context=a}),_defineProperty(this,"transformSpecifier",e=>{let t;const{importedModuleIdentifiers:i,modulePaths:r,t:a}=this.context;t=this.hasDefaultImportSpecifier?a.variableDeclaration("const",[a.variableDeclarator(a.identifier(e.local.name),i[e.local.name])]):a.importDeclaration([a.importDefaultSpecifier(a.identifier(e.local.name))],a.stringLiteral(r[e.local.name])),this.output.push(t)}),_defineProperty(this,"transformDefaultSpecifier",e=>{const{importedModuleIdentifiers:t,modulePaths:i,t:r,path:a}=this.context;e.local.name;for(let e in i)this.output.push(r.importDeclaration([r.importDefaultSpecifier(t[e])],r.stringLiteral(i[e])))}),_defineProperty(this,"generateDefaultExportObject",()=>{const{path:e,importedModuleIdentifiers:t,t:i}=this.context;return i.variableDeclaration("const",[i.variableDeclarator(i.identifier(e.node.specifiers[0].local.name),i.objectExpression(Object.entries(t).map(([e,t])=>i.objectProperty(i.identifier(camelCase(e)),t,!1,!0))))])}),this.setContext(e,t,i),this.output=[]}run(){const{t:e,node:t}=this.context;t.specifiers.map(t=>{e.isImportDefaultSpecifier(t)?(this.hasDefaultImportSpecifier=!0,this.transformDefaultSpecifier(t)):e.isImportSpecifier(t)&&this.transformSpecifier(t)}),this.hasDefaultImportSpecifier&&this.output.push(this.generateDefaultExportObject())}}module.exports=({types:e})=>({visitor:{ImportDeclaration(t,i){const{node:r}=t;if(utils.getFinalPath(r.source.value).includes("*")){const r=new ImportDeclarationHandler({path:t,state:i,t:e});r.run(),t.replaceWithMultiple(r.output)}}}});
