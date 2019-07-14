"use strict";function _defineProperty(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}const fs=require("fs"),pathJoin=require("path").join,utils={modulePathToName:function(e){return[e.split("/").slice(-1)[0],e]},modulePathToInfo:function(e){return{path:e,name:e.split("/").slice(-1)[0]}},getDirs:function(e){return fs.readdirSync(e,{withFileTypes:!0}).filter(e=>e.isDirectory()).map(t=>pathJoin(e,t.name))},getFinalPath:function(e){return e.split("/").filter(e=>""!==e).slice(-1)}},pathJoin$1=require("path").join;class ImportDeclarationHandler{constructor({path:e,state:t,t:i}={path:{},state:{}}){_defineProperty(this,"setContext",(e,t,i)=>{const{node:r}=e,a={path:e,state:t,t:i,node:r};a.cwd=t.file.opts.filename.replace(/(.*)\/[\w-.]+$/,"$1"),a.targetDir=pathJoin$1(a.cwd,r.source.value.replace("/*",""));const o=utils.getDirs(pathJoin$1(a.cwd,a.targetDir)).map(utils.modulePathToInfo);a.modulePaths=o.reduce((e,{path:t,name:i})=>(e[i]=t,e),{}),a.importedModuleNames=o.reduce((e,{name:t})=>(e[t]=t,e),{}),this.context=a}),_defineProperty(this,"transformSpecifier",e=>{let t;const{importedModuleNames:i,modulePaths:r,t:a}=this.context;t=this.hasDefaultImportSpecifier?a.variableDeclaration("const",[a.variableDeclarator(a.identifier(e.local.name),a.identifier(i[e.local.name]))]):a.importDeclaration([a.importDefaultSpecifier(a.identifier(i[e.local.name]))],a.stringLiteral(r[e.local.name])),this.output.push(t)}),_defineProperty(this,"transformDefaultSpecifier",e=>{const{importedModuleNames:t,modulePaths:i,t:r}=this.context,a=e.local.name;for(let e in i)this.context.importedModuleNames[e]=`${a}__${t[e]}`,this.output.push(r.importDeclaration([r.importDefaultSpecifier(r.identifier(t[e]))],r.stringLiteral(i[e])))}),_defineProperty(this,"generateDefaultExportObject",()=>{const{path:e,importedModuleNames:t,t:i}=this.context;return i.variableDeclaration("const",[i.variableDeclarator(i.identifier(e.node.specifiers[0].local.name),i.objectExpression(Object.entries(t).map(([e,t])=>i.objectProperty(i.identifier(e),i.identifier(t),!1,!0))))])}),this.setContext(e,t,i),this.output=[]}run(){const{t:e,node:t}=this.context;t.specifiers.map(t=>{e.isImportDefaultSpecifier(t)?(this.hasDefaultImportSpecifier=!0,this.transformDefaultSpecifier(t)):e.isImportSpecifier(t)&&this.transformSpecifier(t)}),this.hasDefaultImportSpecifier&&this.output.push(this.generateDefaultExportObject())}}module.exports=({types:e})=>({visitor:{ImportDeclaration(t,i){const{node:r}=t;if(utils.getFinalPath(r.source.value).includes("*")){const r=new ImportDeclarationHandler({path:t,state:i,t:e});r.run(),t.replaceWithMultiple(r.output)}}}});
