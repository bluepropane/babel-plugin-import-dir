"use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}var fs=_interopDefault(require("fs")),path$1=_interopDefault(require("path")),util=_interopDefault(require("util")),events=_interopDefault(require("events")),assert=_interopDefault(require("assert"));function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=[],n=!0,i=!1,a=void 0;try{for(var o,s=t[Symbol.iterator]();!(n=(o=s.next()).done)&&(r.push(o.value),!e||r.length!==e);n=!0);}catch(t){i=!0,a=t}finally{try{n||null==s.return||s.return()}finally{if(i)throw a}}return r}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}var isWindows="win32"===process.platform,DEBUG=process.env.NODE_DEBUG&&/fs/.test(process.env.NODE_DEBUG);function rethrow(){var t;if(DEBUG){var e=new Error;t=function(t){t&&(e.message=t.message,r(t=e))}}else t=r;return t;function r(t){if(t){if(process.throwDeprecation)throw t;if(!process.noDeprecation){var e="fs: missing callback "+(t.stack||t.message);process.traceDeprecation?console.trace(e):console.error(e)}}}}function maybeCallback(t){return"function"==typeof t?t:rethrow()}var normalize=path$1.normalize;if(isWindows)var nextPartRe=/(.*?)(?:[\/\\]+|$)/g;else nextPartRe=/(.*?)(?:[\/]+|$)/g;if(isWindows)var splitRootRe=/^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;else splitRootRe=/^[\/]*/;var realpathSync=function(t,e){if(t=path$1.resolve(t),e&&Object.prototype.hasOwnProperty.call(e,t))return e[t];var r,n,i,a,o=t,s={},c={};function h(){var e=splitRootRe.exec(t);r=e[0].length,n=e[0],i=e[0],a="",isWindows&&!c[i]&&(fs.lstatSync(i),c[i]=!0)}for(h();r<t.length;){nextPartRe.lastIndex=r;var l=nextPartRe.exec(t);if(a=n,n+=l[0],i=a+l[1],r=nextPartRe.lastIndex,!(c[i]||e&&e[i]===i)){var p;if(e&&Object.prototype.hasOwnProperty.call(e,i))p=e[i];else{var u=fs.lstatSync(i);if(!u.isSymbolicLink()){c[i]=!0,e&&(e[i]=i);continue}var f=null;if(!isWindows){var m=u.dev.toString(32)+":"+u.ino.toString(32);s.hasOwnProperty(m)&&(f=s[m])}null===f&&(fs.statSync(i),f=fs.readlinkSync(i)),p=path$1.resolve(a,f),e&&(e[i]=p),isWindows||(s[m]=f)}t=path$1.resolve(p,t.slice(r)),h()}}return e&&(e[o]=t),t},realpath=function(t,e,r){if("function"!=typeof r&&(r=maybeCallback(e),e=null),t=path$1.resolve(t),e&&Object.prototype.hasOwnProperty.call(e,t))return process.nextTick(r.bind(null,null,e[t]));var n,i,a,o,s=t,c={},h={};function l(){var e=splitRootRe.exec(t);n=e[0].length,i=e[0],a=e[0],o="",isWindows&&!h[a]?fs.lstat(a,function(t){if(t)return r(t);h[a]=!0,p()}):process.nextTick(p)}function p(){if(n>=t.length)return e&&(e[s]=t),r(null,t);nextPartRe.lastIndex=n;var c=nextPartRe.exec(t);return o=i,i+=c[0],a=o+c[1],n=nextPartRe.lastIndex,h[a]||e&&e[a]===a?process.nextTick(p):e&&Object.prototype.hasOwnProperty.call(e,a)?m(e[a]):fs.lstat(a,u)}function u(t,n){if(t)return r(t);if(!n.isSymbolicLink())return h[a]=!0,e&&(e[a]=a),process.nextTick(p);if(!isWindows){var i=n.dev.toString(32)+":"+n.ino.toString(32);if(c.hasOwnProperty(i))return f(null,c[i],a)}fs.stat(a,function(t){if(t)return r(t);fs.readlink(a,function(t,e){isWindows||(c[i]=e),f(t,e)})})}function f(t,n,i){if(t)return r(t);var a=path$1.resolve(o,n);e&&(e[i]=a),m(a)}function m(e){t=path$1.resolve(e,t.slice(n)),l()}l()},old={realpathSync:realpathSync,realpath:realpath},fs_realpath=realpath$1;realpath$1.realpath=realpath$1,realpath$1.sync=realpathSync$1,realpath$1.realpathSync=realpathSync$1,realpath$1.monkeypatch=monkeypatch,realpath$1.unmonkeypatch=unmonkeypatch;var origRealpath=fs.realpath,origRealpathSync=fs.realpathSync,version=process.version,ok=/^v[0-5]\./.test(version);function newError(t){return t&&"realpath"===t.syscall&&("ELOOP"===t.code||"ENOMEM"===t.code||"ENAMETOOLONG"===t.code)}function realpath$1(t,e,r){if(ok)return origRealpath(t,e,r);"function"==typeof e&&(r=e,e=null),origRealpath(t,e,function(n,i){newError(n)?old.realpath(t,e,r):r(n,i)})}function realpathSync$1(t,e){if(ok)return origRealpathSync(t,e);try{return origRealpathSync(t,e)}catch(r){if(newError(r))return old.realpathSync(t,e);throw r}}function monkeypatch(){fs.realpath=realpath$1,fs.realpathSync=realpathSync$1}function unmonkeypatch(){fs.realpath=origRealpath,fs.realpathSync=origRealpathSync}var concatMap=function(t,e){for(var r=[],n=0;n<t.length;n++){var i=e(t[n],n);isArray(i)?r.push.apply(r,i):r.push(i)}return r},isArray=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},balancedMatch=balanced;function balanced(t,e,r){t instanceof RegExp&&(t=maybeMatch(t,r)),e instanceof RegExp&&(e=maybeMatch(e,r));var n=range(t,e,r);return n&&{start:n[0],end:n[1],pre:r.slice(0,n[0]),body:r.slice(n[0]+t.length,n[1]),post:r.slice(n[1]+e.length)}}function maybeMatch(t,e){var r=e.match(t);return r?r[0]:null}function range(t,e,r){var n,i,a,o,s,c=r.indexOf(t),h=r.indexOf(e,c+1),l=c;if(c>=0&&h>0){for(n=[],a=r.length;l>=0&&!s;)l==c?(n.push(l),c=r.indexOf(t,l+1)):1==n.length?s=[n.pop(),h]:((i=n.pop())<a&&(a=i,o=h),h=r.indexOf(e,l+1)),l=c<h&&c>=0?c:h;n.length&&(s=[a,o])}return s}balanced.range=range;var braceExpansion=expandTop,escSlash="\0SLASH"+Math.random()+"\0",escOpen="\0OPEN"+Math.random()+"\0",escClose="\0CLOSE"+Math.random()+"\0",escComma="\0COMMA"+Math.random()+"\0",escPeriod="\0PERIOD"+Math.random()+"\0";function numeric(t){return parseInt(t,10)==t?parseInt(t,10):t.charCodeAt(0)}function escapeBraces(t){return t.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod)}function unescapeBraces(t){return t.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".")}function parseCommaParts(t){if(!t)return[""];var e=[],r=balancedMatch("{","}",t);if(!r)return t.split(",");var n=r.pre,i=r.body,a=r.post,o=n.split(",");o[o.length-1]+="{"+i+"}";var s=parseCommaParts(a);return a.length&&(o[o.length-1]+=s.shift(),o.push.apply(o,s)),e.push.apply(e,o),e}function expandTop(t){return t?("{}"===t.substr(0,2)&&(t="\\{\\}"+t.substr(2)),expand(escapeBraces(t),!0).map(unescapeBraces)):[]}function embrace(t){return"{"+t+"}"}function isPadded(t){return/^-?0\d/.test(t)}function lte(t,e){return t<=e}function gte(t,e){return t>=e}function expand(t,e){var r=[],n=balancedMatch("{","}",t);if(!n||/\$$/.test(n.pre))return[t];var i,a=/^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(n.body),o=/^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(n.body),s=a||o,c=n.body.indexOf(",")>=0;if(!s&&!c)return n.post.match(/,.*\}/)?expand(t=n.pre+"{"+n.body+escClose+n.post):[t];if(s)i=n.body.split(/\.\./);else if(1===(i=parseCommaParts(n.body)).length&&1===(i=expand(i[0],!1).map(embrace)).length)return(p=n.post.length?expand(n.post,!1):[""]).map(function(t){return n.pre+i[0]+t});var h,l=n.pre,p=n.post.length?expand(n.post,!1):[""];if(s){var u=numeric(i[0]),f=numeric(i[1]),m=Math.max(i[0].length,i[1].length),d=3==i.length?Math.abs(numeric(i[2])):1,b=lte;f<u&&(d*=-1,b=gte);var g=i.some(isPadded);h=[];for(var y=u;b(y,f);y+=d){var v;if(o)"\\"===(v=String.fromCharCode(y))&&(v="");else if(v=String(y),g){var _=m-v.length;if(_>0){var w=new Array(_+1).join("0");v=y<0?"-"+w+v.slice(1):w+v}}h.push(v)}}else h=concatMap(i,function(t){return expand(t,!1)});for(var S=0;S<h.length;S++)for(var E=0;E<p.length;E++){var k=l+h[S]+p[E];(!e||s||k)&&r.push(k)}return r}var minimatch_1=minimatch;minimatch.Minimatch=Minimatch;var path={sep:"/"};try{path=path$1}catch(t){}var GLOBSTAR=minimatch.GLOBSTAR=Minimatch.GLOBSTAR={},plTypes={"!":{open:"(?:(?!(?:",close:"))[^/]*?)"},"?":{open:"(?:",close:")?"},"+":{open:"(?:",close:")+"},"*":{open:"(?:",close:")*"},"@":{open:"(?:",close:")"}},qmark="[^/]",star=qmark+"*?",twoStarDot="(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?",twoStarNoDot="(?:(?!(?:\\/|^)\\.).)*?",reSpecials=charSet("().*{}+?[]^$\\!");function charSet(t){return t.split("").reduce(function(t,e){return t[e]=!0,t},{})}var slashSplit=/\/+/;function filter(t,e){return e=e||{},function(r,n,i){return minimatch(r,t,e)}}function ext(t,e){t=t||{},e=e||{};var r={};return Object.keys(e).forEach(function(t){r[t]=e[t]}),Object.keys(t).forEach(function(e){r[e]=t[e]}),r}function minimatch(t,e,r){if("string"!=typeof e)throw new TypeError("glob pattern string required");return r||(r={}),!(!r.nocomment&&"#"===e.charAt(0))&&(""===e.trim()?""===t:new Minimatch(e,r).match(t))}function Minimatch(t,e){if(!(this instanceof Minimatch))return new Minimatch(t,e);if("string"!=typeof t)throw new TypeError("glob pattern string required");e||(e={}),t=t.trim(),"/"!==path.sep&&(t=t.split(path.sep).join("/")),this.options=e,this.set=[],this.pattern=t,this.regexp=null,this.negate=!1,this.comment=!1,this.empty=!1,this.make()}function make(){if(!this._made){var t=this.pattern,e=this.options;if(e.nocomment||"#"!==t.charAt(0))if(t){this.parseNegate();var r=this.globSet=this.braceExpand();e.debug&&(this.debug=console.error),this.debug(this.pattern,r),r=this.globParts=r.map(function(t){return t.split(slashSplit)}),this.debug(this.pattern,r),r=r.map(function(t,e,r){return t.map(this.parse,this)},this),this.debug(this.pattern,r),r=r.filter(function(t){return-1===t.indexOf(!1)}),this.debug(this.pattern,r),this.set=r}else this.empty=!0;else this.comment=!0}}function parseNegate(){var t=this.pattern,e=!1,r=0;if(!this.options.nonegate){for(var n=0,i=t.length;n<i&&"!"===t.charAt(n);n++)e=!e,r++;r&&(this.pattern=t.substr(r)),this.negate=e}}function braceExpand(t,e){if(e||(e=this instanceof Minimatch?this.options:{}),void 0===(t=void 0===t?this.pattern:t))throw new TypeError("undefined pattern");return e.nobrace||!t.match(/\{.*\}/)?[t]:braceExpansion(t)}minimatch.filter=filter,minimatch.defaults=function(t){if(!t||!Object.keys(t).length)return minimatch;var e=minimatch,r=function(r,n,i){return e.minimatch(r,n,ext(t,i))};return r.Minimatch=function(r,n){return new e.Minimatch(r,ext(t,n))},r},Minimatch.defaults=function(t){return t&&Object.keys(t).length?minimatch.defaults(t).Minimatch:Minimatch},Minimatch.prototype.debug=function(){},Minimatch.prototype.make=make,Minimatch.prototype.parseNegate=parseNegate,minimatch.braceExpand=function(t,e){return braceExpand(t,e)},Minimatch.prototype.braceExpand=braceExpand,Minimatch.prototype.parse=parse;var SUBPARSE={};function parse(t,e){if(t.length>65536)throw new TypeError("pattern is too long");var r=this.options;if(!r.noglobstar&&"**"===t)return GLOBSTAR;if(""===t)return"";var n,i="",a=!!r.nocase,o=!1,s=[],c=[],h=!1,l=-1,p=-1,u="."===t.charAt(0)?"":r.dot?"(?!(?:^|\\/)\\.{1,2}(?:$|\\/))":"(?!\\.)",f=this;function m(){if(n){switch(n){case"*":i+=star,a=!0;break;case"?":i+=qmark,a=!0;break;default:i+="\\"+n}f.debug("clearStateChar %j %j",n,i),n=!1}}for(var d,b=0,g=t.length;b<g&&(d=t.charAt(b));b++)if(this.debug("%s\t%s %s %j",t,b,i,d),o&&reSpecials[d])i+="\\"+d,o=!1;else switch(d){case"/":return!1;case"\\":m(),o=!0;continue;case"?":case"*":case"+":case"@":case"!":if(this.debug("%s\t%s %s %j <-- stateChar",t,b,i,d),h){this.debug("  in class"),"!"===d&&b===p+1&&(d="^"),i+=d;continue}f.debug("call clearStateChar %j",n),m(),n=d,r.noext&&m();continue;case"(":if(h){i+="(";continue}if(!n){i+="\\(";continue}s.push({type:n,start:b-1,reStart:i.length,open:plTypes[n].open,close:plTypes[n].close}),i+="!"===n?"(?:(?!(?:":"(?:",this.debug("plType %j %j",n,i),n=!1;continue;case")":if(h||!s.length){i+="\\)";continue}m(),a=!0;var y=s.pop();i+=y.close,"!"===y.type&&c.push(y),y.reEnd=i.length;continue;case"|":if(h||!s.length||o){i+="\\|",o=!1;continue}m(),i+="|";continue;case"[":if(m(),h){i+="\\"+d;continue}h=!0,p=b,l=i.length,i+=d;continue;case"]":if(b===p+1||!h){i+="\\"+d,o=!1;continue}if(h){var v=t.substring(p+1,b);try{RegExp("["+v+"]")}catch(t){var _=this.parse(v,SUBPARSE);i=i.substr(0,l)+"\\["+_[0]+"\\]",a=a||_[1],h=!1;continue}}a=!0,h=!1,i+=d;continue;default:m(),o?o=!1:!reSpecials[d]||"^"===d&&h||(i+="\\"),i+=d}for(h&&(v=t.substr(p+1),_=this.parse(v,SUBPARSE),i=i.substr(0,l)+"\\["+_[0],a=a||_[1]),y=s.pop();y;y=s.pop()){var w=i.slice(y.reStart+y.open.length);this.debug("setting tail",i,y),w=w.replace(/((?:\\{2}){0,64})(\\?)\|/g,function(t,e,r){return r||(r="\\"),e+e+r+"|"}),this.debug("tail=%j\n   %s",w,w,y,i);var S="*"===y.type?star:"?"===y.type?qmark:"\\"+y.type;a=!0,i=i.slice(0,y.reStart)+S+"\\("+w}m(),o&&(i+="\\\\");var E=!1;switch(i.charAt(0)){case".":case"[":case"(":E=!0}for(var k=c.length-1;k>-1;k--){var A=c[k],O=i.slice(0,A.reStart),x=i.slice(A.reStart,A.reEnd-8),I=i.slice(A.reEnd-8,A.reEnd),$=i.slice(A.reEnd);I+=$;var j=O.split("(").length-1,G=$;for(b=0;b<j;b++)G=G.replace(/\)[+*?]?/,"");var P="";""===($=G)&&e!==SUBPARSE&&(P="$"),i=O+x+$+P+I}if(""!==i&&a&&(i="(?=.)"+i),E&&(i=u+i),e===SUBPARSE)return[i,a];if(!a)return globUnescape(t);var R=r.nocase?"i":"";try{var M=new RegExp("^"+i+"$",R)}catch(t){return new RegExp("$.")}return M._glob=t,M._src=i,M}function makeRe(){if(this.regexp||!1===this.regexp)return this.regexp;var t=this.set;if(!t.length)return this.regexp=!1,this.regexp;var e=this.options,r=e.noglobstar?star:e.dot?twoStarDot:twoStarNoDot,n=e.nocase?"i":"",i=t.map(function(t){return t.map(function(t){return t===GLOBSTAR?r:"string"==typeof t?regExpEscape(t):t._src}).join("\\/")}).join("|");i="^(?:"+i+")$",this.negate&&(i="^(?!"+i+").*$");try{this.regexp=new RegExp(i,n)}catch(t){this.regexp=!1}return this.regexp}function match(t,e){if(this.debug("match",t,this.pattern),this.comment)return!1;if(this.empty)return""===t;if("/"===t&&e)return!0;var r=this.options;"/"!==path.sep&&(t=t.split(path.sep).join("/")),t=t.split(slashSplit),this.debug(this.pattern,"split",t);var n,i,a=this.set;for(this.debug(this.pattern,"set",a),i=t.length-1;i>=0&&!(n=t[i]);i--);for(i=0;i<a.length;i++){var o=a[i],s=t;if(r.matchBase&&1===o.length&&(s=[n]),this.matchOne(s,o,e))return!!r.flipNegate||!this.negate}return!r.flipNegate&&this.negate}function globUnescape(t){return t.replace(/\\(.)/g,"$1")}function regExpEscape(t){return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}function createCommonjsModule(t,e){return t(e={exports:{}},e.exports),e.exports}minimatch.makeRe=function(t,e){return new Minimatch(t,e||{}).makeRe()},Minimatch.prototype.makeRe=makeRe,minimatch.match=function(t,e,r){var n=new Minimatch(e,r=r||{});return t=t.filter(function(t){return n.match(t)}),n.options.nonull&&!t.length&&t.push(e),t},Minimatch.prototype.match=match,Minimatch.prototype.matchOne=function(t,e,r){var n=this.options;this.debug("matchOne",{this:this,file:t,pattern:e}),this.debug("matchOne",t.length,e.length);for(var i=0,a=0,o=t.length,s=e.length;i<o&&a<s;i++,a++){this.debug("matchOne loop");var c,h=e[a],l=t[i];if(this.debug(e,h,l),!1===h)return!1;if(h===GLOBSTAR){this.debug("GLOBSTAR",[e,h,l]);var p=i,u=a+1;if(u===s){for(this.debug("** at the end");i<o;i++)if("."===t[i]||".."===t[i]||!n.dot&&"."===t[i].charAt(0))return!1;return!0}for(;p<o;){var f=t[p];if(this.debug("\nglobstar while",t,p,e,u,f),this.matchOne(t.slice(p),e.slice(u),r))return this.debug("globstar found match!",p,o,f),!0;if("."===f||".."===f||!n.dot&&"."===f.charAt(0)){this.debug("dot detected!",t,p,e,u);break}this.debug("globstar swallow a segment, and continue"),p++}return!(!r||(this.debug("\n>>> no match, partial?",t,p,e,u),p!==o))}if("string"==typeof h?(c=n.nocase?l.toLowerCase()===h.toLowerCase():l===h,this.debug("string match",h,l,c)):(c=l.match(h),this.debug("pattern match",h,l,c)),!c)return!1}if(i===o&&a===s)return!0;if(i===o)return r;if(a===s)return i===o-1&&""===t[i];throw new Error("wtf?")};var inherits_browser=createCommonjsModule(function(t){"function"==typeof Object.create?t.exports=function(t,e){e&&(t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:t.exports=function(t,e){if(e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}}}),inherits=createCommonjsModule(function(t){try{var e=util;if("function"!=typeof e.inherits)throw"";t.exports=e.inherits}catch(e){t.exports=inherits_browser}});function posix(t){return"/"===t.charAt(0)}function win32(t){var e=/^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(t),r=e[1]||"",n=Boolean(r&&":"!==r.charAt(1));return Boolean(e[2]||n)}var pathIsAbsolute="win32"===process.platform?win32:posix,posix_1=posix,win32_1=win32;pathIsAbsolute.posix=posix_1,pathIsAbsolute.win32=win32_1;var alphasort_1=alphasort,alphasorti_1=alphasorti,setopts_1=setopts,ownProp_1=ownProp,makeAbs_1=makeAbs,finish_1=finish,mark_1=mark,isIgnored_1=isIgnored,childrenIgnored_1=childrenIgnored;function ownProp(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var Minimatch$1=minimatch_1.Minimatch;function alphasorti(t,e){return t.toLowerCase().localeCompare(e.toLowerCase())}function alphasort(t,e){return t.localeCompare(e)}function setupIgnores(t,e){t.ignore=e.ignore||[],Array.isArray(t.ignore)||(t.ignore=[t.ignore]),t.ignore.length&&(t.ignore=t.ignore.map(ignoreMap))}function ignoreMap(t){var e=null;if("/**"===t.slice(-3)){var r=t.replace(/(\/\*\*)+$/,"");e=new Minimatch$1(r,{dot:!0})}return{matcher:new Minimatch$1(t,{dot:!0}),gmatcher:e}}function setopts(t,e,r){if(r||(r={}),r.matchBase&&-1===e.indexOf("/")){if(r.noglobstar)throw new Error("base matching requires globstar");e="**/"+e}t.silent=!!r.silent,t.pattern=e,t.strict=!1!==r.strict,t.realpath=!!r.realpath,t.realpathCache=r.realpathCache||Object.create(null),t.follow=!!r.follow,t.dot=!!r.dot,t.mark=!!r.mark,t.nodir=!!r.nodir,t.nodir&&(t.mark=!0),t.sync=!!r.sync,t.nounique=!!r.nounique,t.nonull=!!r.nonull,t.nosort=!!r.nosort,t.nocase=!!r.nocase,t.stat=!!r.stat,t.noprocess=!!r.noprocess,t.absolute=!!r.absolute,t.maxLength=r.maxLength||1/0,t.cache=r.cache||Object.create(null),t.statCache=r.statCache||Object.create(null),t.symlinks=r.symlinks||Object.create(null),setupIgnores(t,r),t.changedCwd=!1;var n=process.cwd();ownProp(r,"cwd")?(t.cwd=path$1.resolve(r.cwd),t.changedCwd=t.cwd!==n):t.cwd=n,t.root=r.root||path$1.resolve(t.cwd,"/"),t.root=path$1.resolve(t.root),"win32"===process.platform&&(t.root=t.root.replace(/\\/g,"/")),t.cwdAbs=pathIsAbsolute(t.cwd)?t.cwd:makeAbs(t,t.cwd),"win32"===process.platform&&(t.cwdAbs=t.cwdAbs.replace(/\\/g,"/")),t.nomount=!!r.nomount,r.nonegate=!0,r.nocomment=!0,t.minimatch=new Minimatch$1(e,r),t.options=t.minimatch.options}function finish(t){for(var e=t.nounique,r=e?[]:Object.create(null),n=0,i=t.matches.length;n<i;n++){var a=t.matches[n];if(a&&0!==Object.keys(a).length){var o=Object.keys(a);e?r.push.apply(r,o):o.forEach(function(t){r[t]=!0})}else if(t.nonull){var s=t.minimatch.globSet[n];e?r.push(s):r[s]=!0}}if(e||(r=Object.keys(r)),t.nosort||(r=r.sort(t.nocase?alphasorti:alphasort)),t.mark){for(n=0;n<r.length;n++)r[n]=t._mark(r[n]);t.nodir&&(r=r.filter(function(e){var r=!/\/$/.test(e),n=t.cache[e]||t.cache[makeAbs(t,e)];return r&&n&&(r="DIR"!==n&&!Array.isArray(n)),r}))}t.ignore.length&&(r=r.filter(function(e){return!isIgnored(t,e)})),t.found=r}function mark(t,e){var r=makeAbs(t,e),n=t.cache[r],i=e;if(n){var a="DIR"===n||Array.isArray(n),o="/"===e.slice(-1);if(a&&!o?i+="/":!a&&o&&(i=i.slice(0,-1)),i!==e){var s=makeAbs(t,i);t.statCache[s]=t.statCache[r],t.cache[s]=t.cache[r]}}return i}function makeAbs(t,e){var r=e;return r="/"===e.charAt(0)?path$1.join(t.root,e):pathIsAbsolute(e)||""===e?e:t.changedCwd?path$1.resolve(t.cwd,e):path$1.resolve(e),"win32"===process.platform&&(r=r.replace(/\\/g,"/")),r}function isIgnored(t,e){return!!t.ignore.length&&t.ignore.some(function(t){return t.matcher.match(e)||!(!t.gmatcher||!t.gmatcher.match(e))})}function childrenIgnored(t,e){return!!t.ignore.length&&t.ignore.some(function(t){return!(!t.gmatcher||!t.gmatcher.match(e))})}var common={alphasort:alphasort_1,alphasorti:alphasorti_1,setopts:setopts_1,ownProp:ownProp_1,makeAbs:makeAbs_1,finish:finish_1,mark:mark_1,isIgnored:isIgnored_1,childrenIgnored:childrenIgnored_1},sync=globSync;globSync.GlobSync=GlobSync;var setopts$1=common.setopts,ownProp$1=common.ownProp,childrenIgnored$1=common.childrenIgnored,isIgnored$1=common.isIgnored;function globSync(t,e){if("function"==typeof e||3===arguments.length)throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");return new GlobSync(t,e).found}function GlobSync(t,e){if(!t)throw new Error("must provide pattern");if("function"==typeof e||3===arguments.length)throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");if(!(this instanceof GlobSync))return new GlobSync(t,e);if(setopts$1(this,t,e),this.noprocess)return this;var r=this.minimatch.set.length;this.matches=new Array(r);for(var n=0;n<r;n++)this._process(this.minimatch.set[n],n,!1);this._finish()}GlobSync.prototype._finish=function(){if(assert(this instanceof GlobSync),this.realpath){var t=this;this.matches.forEach(function(e,r){var n=t.matches[r]=Object.create(null);for(var i in e)try{i=t._makeAbs(i),n[fs_realpath.realpathSync(i,t.realpathCache)]=!0}catch(e){if("stat"!==e.syscall)throw e;n[t._makeAbs(i)]=!0}})}common.finish(this)},GlobSync.prototype._process=function(t,e,r){assert(this instanceof GlobSync);for(var n,i=0;"string"==typeof t[i];)i++;switch(i){case t.length:return void this._processSimple(t.join("/"),e);case 0:n=null;break;default:n=t.slice(0,i).join("/")}var a,o=t.slice(i);null===n?a=".":pathIsAbsolute(n)||pathIsAbsolute(t.join("/"))?(n&&pathIsAbsolute(n)||(n="/"+n),a=n):a=n;var s=this._makeAbs(a);childrenIgnored$1(this,a)||(o[0]===minimatch_1.GLOBSTAR?this._processGlobStar(n,a,s,o,e,r):this._processReaddir(n,a,s,o,e,r))},GlobSync.prototype._processReaddir=function(t,e,r,n,i,a){var o=this._readdir(r,a);if(o){for(var s=n[0],c=!!this.minimatch.negate,h=s._glob,l=this.dot||"."===h.charAt(0),p=[],u=0;u<o.length;u++){if("."!==(d=o[u]).charAt(0)||l)(c&&!t?!d.match(s):d.match(s))&&p.push(d)}var f=p.length;if(0!==f)if(1!==n.length||this.mark||this.stat){n.shift();for(u=0;u<f;u++){var m;d=p[u];m=t?[t,d]:[d],this._process(m.concat(n),i,a)}}else{this.matches[i]||(this.matches[i]=Object.create(null));for(var u=0;u<f;u++){var d=p[u];t&&(d="/"!==t.slice(-1)?t+"/"+d:t+d),"/"!==d.charAt(0)||this.nomount||(d=path$1.join(this.root,d)),this._emitMatch(i,d)}}}},GlobSync.prototype._emitMatch=function(t,e){if(!isIgnored$1(this,e)){var r=this._makeAbs(e);if(this.mark&&(e=this._mark(e)),this.absolute&&(e=r),!this.matches[t][e]){if(this.nodir){var n=this.cache[r];if("DIR"===n||Array.isArray(n))return}this.matches[t][e]=!0,this.stat&&this._stat(e)}}},GlobSync.prototype._readdirInGlobStar=function(t){if(this.follow)return this._readdir(t,!1);var e,r;try{r=fs.lstatSync(t)}catch(t){if("ENOENT"===t.code)return null}var n=r&&r.isSymbolicLink();return this.symlinks[t]=n,n||!r||r.isDirectory()?e=this._readdir(t,!1):this.cache[t]="FILE",e},GlobSync.prototype._readdir=function(t,e){if(e&&!ownProp$1(this.symlinks,t))return this._readdirInGlobStar(t);if(ownProp$1(this.cache,t)){var r=this.cache[t];if(!r||"FILE"===r)return null;if(Array.isArray(r))return r}try{return this._readdirEntries(t,fs.readdirSync(t))}catch(e){return this._readdirError(t,e),null}},GlobSync.prototype._readdirEntries=function(t,e){if(!this.mark&&!this.stat)for(var r=0;r<e.length;r++){var n=e[r];n="/"===t?t+n:t+"/"+n,this.cache[n]=!0}return this.cache[t]=e,e},GlobSync.prototype._readdirError=function(t,e){switch(e.code){case"ENOTSUP":case"ENOTDIR":var r=this._makeAbs(t);if(this.cache[r]="FILE",r===this.cwdAbs){var n=new Error(e.code+" invalid cwd "+this.cwd);throw n.path=this.cwd,n.code=e.code,n}break;case"ENOENT":case"ELOOP":case"ENAMETOOLONG":case"UNKNOWN":this.cache[this._makeAbs(t)]=!1;break;default:if(this.cache[this._makeAbs(t)]=!1,this.strict)throw e;this.silent||console.error("glob error",e)}},GlobSync.prototype._processGlobStar=function(t,e,r,n,i,a){var o=this._readdir(r,a);if(o){var s=n.slice(1),c=t?[t]:[],h=c.concat(s);this._process(h,i,!1);var l=o.length;if(!this.symlinks[r]||!a)for(var p=0;p<l;p++){if("."!==o[p].charAt(0)||this.dot){var u=c.concat(o[p],s);this._process(u,i,!0);var f=c.concat(o[p],n);this._process(f,i,!0)}}}},GlobSync.prototype._processSimple=function(t,e){var r=this._stat(t);if(this.matches[e]||(this.matches[e]=Object.create(null)),r){if(t&&pathIsAbsolute(t)&&!this.nomount){var n=/[\/\\]$/.test(t);"/"===t.charAt(0)?t=path$1.join(this.root,t):(t=path$1.resolve(this.root,t),n&&(t+="/"))}"win32"===process.platform&&(t=t.replace(/\\/g,"/")),this._emitMatch(e,t)}},GlobSync.prototype._stat=function(t){var e=this._makeAbs(t),r="/"===t.slice(-1);if(t.length>this.maxLength)return!1;if(!this.stat&&ownProp$1(this.cache,e)){var n=this.cache[e];if(Array.isArray(n)&&(n="DIR"),!r||"DIR"===n)return n;if(r&&"FILE"===n)return!1}var i=this.statCache[e];if(!i){var a;try{a=fs.lstatSync(e)}catch(t){if(t&&("ENOENT"===t.code||"ENOTDIR"===t.code))return this.statCache[e]=!1,!1}if(a&&a.isSymbolicLink())try{i=fs.statSync(e)}catch(t){i=a}else i=a}this.statCache[e]=i;n=!0;return i&&(n=i.isDirectory()?"DIR":"FILE"),this.cache[e]=this.cache[e]||n,(!r||"FILE"!==n)&&n},GlobSync.prototype._mark=function(t){return common.mark(this,t)},GlobSync.prototype._makeAbs=function(t){return common.makeAbs(this,t)};var wrappy_1=wrappy;function wrappy(t,e){if(t&&e)return wrappy(t)(e);if("function"!=typeof t)throw new TypeError("need wrapper function");return Object.keys(t).forEach(function(e){r[e]=t[e]}),r;function r(){for(var e=new Array(arguments.length),r=0;r<e.length;r++)e[r]=arguments[r];var n=t.apply(this,e),i=e[e.length-1];return"function"==typeof n&&n!==i&&Object.keys(i).forEach(function(t){n[t]=i[t]}),n}}var once_1=wrappy_1(once),strict=wrappy_1(onceStrict);function once(t){var e=function(){return e.called?e.value:(e.called=!0,e.value=t.apply(this,arguments))};return e.called=!1,e}function onceStrict(t){var e=function(){if(e.called)throw new Error(e.onceError);return e.called=!0,e.value=t.apply(this,arguments)},r=t.name||"Function wrapped with `once`";return e.onceError=r+" shouldn't be called more than once",e.called=!1,e}once.proto=once(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return once(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return onceStrict(this)},configurable:!0})}),once_1.strict=strict;var reqs=Object.create(null),inflight_1=wrappy_1(inflight);function inflight(t,e){return reqs[t]?(reqs[t].push(e),null):(reqs[t]=[e],makeres(t))}function makeres(t){return once_1(function e(){var r=reqs[t],n=r.length,i=slice(arguments);try{for(var a=0;a<n;a++)r[a].apply(null,i)}finally{r.length>n?(r.splice(0,n),process.nextTick(function(){e.apply(null,i)})):delete reqs[t]}})}function slice(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n]=t[n];return r}var glob_1=glob,EE=events.EventEmitter,setopts$2=common.setopts,ownProp$2=common.ownProp,childrenIgnored$2=common.childrenIgnored,isIgnored$2=common.isIgnored;function glob(t,e,r){if("function"==typeof e&&(r=e,e={}),e||(e={}),e.sync){if(r)throw new TypeError("callback provided to sync glob");return sync(t,e)}return new Glob(t,e,r)}glob.sync=sync;var GlobSync$1=glob.GlobSync=sync.GlobSync;function extend(t,e){if(null===e||"object"!=typeof e)return t;for(var r=Object.keys(e),n=r.length;n--;)t[r[n]]=e[r[n]];return t}function Glob(t,e,r){if("function"==typeof e&&(r=e,e=null),e&&e.sync){if(r)throw new TypeError("callback provided to sync glob");return new GlobSync$1(t,e)}if(!(this instanceof Glob))return new Glob(t,e,r);setopts$2(this,t,e),this._didRealPath=!1;var n=this.minimatch.set.length;this.matches=new Array(n),"function"==typeof r&&(r=once_1(r),this.on("error",r),this.on("end",function(t){r(null,t)}));var i=this;if(this._processing=0,this._emitQueue=[],this._processQueue=[],this.paused=!1,this.noprocess)return this;if(0===n)return s();for(var a=!0,o=0;o<n;o++)this._process(this.minimatch.set[o],o,!1,s);function s(){--i._processing,i._processing<=0&&(a?process.nextTick(function(){i._finish()}):i._finish())}a=!1}function readdirCb(t,e,r){return function(n,i){n?t._readdirError(e,n,r):t._readdirEntries(e,i,r)}}glob.glob=glob,glob.hasMagic=function(t,e){var r=extend({},e);r.noprocess=!0;var n=new Glob(t,r).minimatch.set;if(!t)return!1;if(n.length>1)return!0;for(var i=0;i<n[0].length;i++)if("string"!=typeof n[0][i])return!0;return!1},glob.Glob=Glob,inherits(Glob,EE),Glob.prototype._finish=function(){if(assert(this instanceof Glob),!this.aborted){if(this.realpath&&!this._didRealpath)return this._realpath();common.finish(this),this.emit("end",this.found)}},Glob.prototype._realpath=function(){if(!this._didRealpath){this._didRealpath=!0;var t=this.matches.length;if(0===t)return this._finish();for(var e=this,r=0;r<this.matches.length;r++)this._realpathSet(r,n)}function n(){0==--t&&e._finish()}},Glob.prototype._realpathSet=function(t,e){var r=this.matches[t];if(!r)return e();var n=Object.keys(r),i=this,a=n.length;if(0===a)return e();var o=this.matches[t]=Object.create(null);n.forEach(function(r,n){r=i._makeAbs(r),fs_realpath.realpath(r,i.realpathCache,function(n,s){n?"stat"===n.syscall?o[r]=!0:i.emit("error",n):o[s]=!0,0==--a&&(i.matches[t]=o,e())})})},Glob.prototype._mark=function(t){return common.mark(this,t)},Glob.prototype._makeAbs=function(t){return common.makeAbs(this,t)},Glob.prototype.abort=function(){this.aborted=!0,this.emit("abort")},Glob.prototype.pause=function(){this.paused||(this.paused=!0,this.emit("pause"))},Glob.prototype.resume=function(){if(this.paused){if(this.emit("resume"),this.paused=!1,this._emitQueue.length){var t=this._emitQueue.slice(0);this._emitQueue.length=0;for(var e=0;e<t.length;e++){var r=t[e];this._emitMatch(r[0],r[1])}}if(this._processQueue.length){var n=this._processQueue.slice(0);this._processQueue.length=0;for(e=0;e<n.length;e++){var i=n[e];this._processing--,this._process(i[0],i[1],i[2],i[3])}}}},Glob.prototype._process=function(t,e,r,n){if(assert(this instanceof Glob),assert("function"==typeof n),!this.aborted)if(this._processing++,this.paused)this._processQueue.push([t,e,r,n]);else{for(var i,a=0;"string"==typeof t[a];)a++;switch(a){case t.length:return void this._processSimple(t.join("/"),e,n);case 0:i=null;break;default:i=t.slice(0,a).join("/")}var o,s=t.slice(a);null===i?o=".":pathIsAbsolute(i)||pathIsAbsolute(t.join("/"))?(i&&pathIsAbsolute(i)||(i="/"+i),o=i):o=i;var c=this._makeAbs(o);if(childrenIgnored$2(this,o))return n();s[0]===minimatch_1.GLOBSTAR?this._processGlobStar(i,o,c,s,e,r,n):this._processReaddir(i,o,c,s,e,r,n)}},Glob.prototype._processReaddir=function(t,e,r,n,i,a,o){var s=this;this._readdir(r,a,function(c,h){return s._processReaddir2(t,e,r,n,i,a,h,o)})},Glob.prototype._processReaddir2=function(t,e,r,n,i,a,o,s){if(!o)return s();for(var c=n[0],h=!!this.minimatch.negate,l=c._glob,p=this.dot||"."===l.charAt(0),u=[],f=0;f<o.length;f++){if("."!==(d=o[f]).charAt(0)||p)(h&&!t?!d.match(c):d.match(c))&&u.push(d)}var m=u.length;if(0===m)return s();if(1===n.length&&!this.mark&&!this.stat){this.matches[i]||(this.matches[i]=Object.create(null));for(f=0;f<m;f++){var d=u[f];t&&(d="/"!==t?t+"/"+d:t+d),"/"!==d.charAt(0)||this.nomount||(d=path$1.join(this.root,d)),this._emitMatch(i,d)}return s()}n.shift();for(f=0;f<m;f++){d=u[f];t&&(d="/"!==t?t+"/"+d:t+d),this._process([d].concat(n),i,a,s)}s()},Glob.prototype._emitMatch=function(t,e){if(!this.aborted&&!isIgnored$2(this,e))if(this.paused)this._emitQueue.push([t,e]);else{var r=pathIsAbsolute(e)?e:this._makeAbs(e);if(this.mark&&(e=this._mark(e)),this.absolute&&(e=r),!this.matches[t][e]){if(this.nodir){var n=this.cache[r];if("DIR"===n||Array.isArray(n))return}this.matches[t][e]=!0;var i=this.statCache[r];i&&this.emit("stat",e,i),this.emit("match",e)}}},Glob.prototype._readdirInGlobStar=function(t,e){if(!this.aborted){if(this.follow)return this._readdir(t,!1,e);var r=this,n=inflight_1("lstat\0"+t,function(n,i){if(n&&"ENOENT"===n.code)return e();var a=i&&i.isSymbolicLink();r.symlinks[t]=a,a||!i||i.isDirectory()?r._readdir(t,!1,e):(r.cache[t]="FILE",e())});n&&fs.lstat(t,n)}},Glob.prototype._readdir=function(t,e,r){if(!this.aborted&&(r=inflight_1("readdir\0"+t+"\0"+e,r))){if(e&&!ownProp$2(this.symlinks,t))return this._readdirInGlobStar(t,r);if(ownProp$2(this.cache,t)){var n=this.cache[t];if(!n||"FILE"===n)return r();if(Array.isArray(n))return r(null,n)}fs.readdir(t,readdirCb(this,t,r))}},Glob.prototype._readdirEntries=function(t,e,r){if(!this.aborted){if(!this.mark&&!this.stat)for(var n=0;n<e.length;n++){var i=e[n];i="/"===t?t+i:t+"/"+i,this.cache[i]=!0}return this.cache[t]=e,r(null,e)}},Glob.prototype._readdirError=function(t,e,r){if(!this.aborted){switch(e.code){case"ENOTSUP":case"ENOTDIR":var n=this._makeAbs(t);if(this.cache[n]="FILE",n===this.cwdAbs){var i=new Error(e.code+" invalid cwd "+this.cwd);i.path=this.cwd,i.code=e.code,this.emit("error",i),this.abort()}break;case"ENOENT":case"ELOOP":case"ENAMETOOLONG":case"UNKNOWN":this.cache[this._makeAbs(t)]=!1;break;default:this.cache[this._makeAbs(t)]=!1,this.strict&&(this.emit("error",e),this.abort()),this.silent||console.error("glob error",e)}return r()}},Glob.prototype._processGlobStar=function(t,e,r,n,i,a,o){var s=this;this._readdir(r,a,function(c,h){s._processGlobStar2(t,e,r,n,i,a,h,o)})},Glob.prototype._processGlobStar2=function(t,e,r,n,i,a,o,s){if(!o)return s();var c=n.slice(1),h=t?[t]:[],l=h.concat(c);this._process(l,i,!1,s);var p=this.symlinks[r],u=o.length;if(p&&a)return s();for(var f=0;f<u;f++){if("."!==o[f].charAt(0)||this.dot){var m=h.concat(o[f],c);this._process(m,i,!0,s);var d=h.concat(o[f],n);this._process(d,i,!0,s)}}s()},Glob.prototype._processSimple=function(t,e,r){var n=this;this._stat(t,function(i,a){n._processSimple2(t,e,i,a,r)})},Glob.prototype._processSimple2=function(t,e,r,n,i){if(this.matches[e]||(this.matches[e]=Object.create(null)),!n)return i();if(t&&pathIsAbsolute(t)&&!this.nomount){var a=/[\/\\]$/.test(t);"/"===t.charAt(0)?t=path$1.join(this.root,t):(t=path$1.resolve(this.root,t),a&&(t+="/"))}"win32"===process.platform&&(t=t.replace(/\\/g,"/")),this._emitMatch(e,t),i()},Glob.prototype._stat=function(t,e){var r=this._makeAbs(t),n="/"===t.slice(-1);if(t.length>this.maxLength)return e();if(!this.stat&&ownProp$2(this.cache,r)){var i=this.cache[r];if(Array.isArray(i)&&(i="DIR"),!n||"DIR"===i)return e(null,i);if(n&&"FILE"===i)return e()}var a=this.statCache[r];if(void 0!==a){if(!1===a)return e(null,a);var o=a.isDirectory()?"DIR":"FILE";return n&&"FILE"===o?e():e(null,o,a)}var s=this,c=inflight_1("stat\0"+r,function(n,i){if(i&&i.isSymbolicLink())return fs.stat(r,function(n,a){n?s._stat2(t,r,null,i,e):s._stat2(t,r,n,a,e)});s._stat2(t,r,n,i,e)});c&&fs.lstat(r,c)},Glob.prototype._stat2=function(t,e,r,n,i){if(r&&("ENOENT"===r.code||"ENOTDIR"===r.code))return this.statCache[e]=!1,i();var a="/"===t.slice(-1);if(this.statCache[e]=n,"/"===e.slice(-1)&&n&&!n.isDirectory())return i(null,!1,n);var o=!0;return n&&(o=n.isDirectory()?"DIR":"FILE"),this.cache[e]=this.cache[e]||o,a&&"FILE"===o?i():i(null,o,n)};var pathJoin=path$1.join,MATCH_MODULE_FILES=/\.(js|jsx|ts)$/g,utils={modulePathToName:function(t){return[t.split("/").slice(-1)[0],t]},modulePathToInfo:function(t){return{path:t,name:t.split("/").slice(-1)[0]}},getModulesFromPattern:function(t,e){return glob_1.sync(t,{mark:!0,cwd:e}).filter(function(t){return MATCH_MODULE_FILES.exec(t)||t.endsWith("/")}).map(function(t){return t=t.endsWith("/")?t.slice(0,-1):t.replace(MATCH_MODULE_FILES,"")})},getFinalPath:function(t){return t.split("/").filter(function(t){return""!==t}).slice(-1)},prependDotSlash:function(t){t.forEach(function(t){t.path.startsWith("./")||(t.path="./"+t.path)})}},utils_1=utils,pathJoin$1=require("path").join,camelCase=require("lodash.camelcase"),ImportDeclarationHandler=function(){function t(){var e=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{path:{},state:{}},n=r.path,i=r.state,a=r.t;_classCallCheck(this,t),_defineProperty(this,"setContext",function(t,r,n){var i=t.node,a={path:t,state:r,t:n,node:i};a.cwd=r.file.opts.filename.replace(/(.*)\/[\w-.]+$/,"$1"),a.targetPattern=pathJoin$1(i.source.value);var o=utils_1.getModulesFromPattern(a.targetPattern,a.cwd).map(utils_1.modulePathToInfo);i.source.value.startsWith("./")&&utils_1.prependDotSlash(o),console.log("hi",a.targetPattern,o),a.modulePaths=o.reduce(function(t,e){var r=e.path;return t[e.name]=r,t},{}),a.importedModuleIdentifiers=o.reduce(function(e,r){var n=r.name;return e[n]=t.scope.generateUidIdentifier(n),e},{}),e.context=a}),_defineProperty(this,"transformSpecifier",function(t){var r,n=e.context,i=n.importedModuleIdentifiers,a=n.modulePaths,o=n.t;r=e.hasDefaultImportSpecifier?o.variableDeclaration("const",[o.variableDeclarator(o.identifier(t.local.name),i[t.local.name])]):o.importDeclaration([o.importDefaultSpecifier(o.identifier(t.local.name))],o.stringLiteral(a[t.local.name])),e.output.push(r)}),_defineProperty(this,"transformDefaultSpecifier",function(t){var r=e.context,n=r.importedModuleIdentifiers,i=r.modulePaths,a=r.t;r.path,t.local.name;for(var o in i)e.output.push(a.importDeclaration([a.importDefaultSpecifier(n[o])],a.stringLiteral(i[o])))}),_defineProperty(this,"generateDefaultExportObject",function(){var t=e.context,r=t.path,n=t.importedModuleIdentifiers,i=t.t;return i.variableDeclaration("const",[i.variableDeclarator(i.identifier(r.node.specifiers[0].local.name),i.objectExpression(Object.entries(n).map(function(t){var e=_slicedToArray(t,2),r=e[0],n=e[1];return i.objectProperty(i.identifier(camelCase(r)),n,!1,!0)})))])}),this.setContext(n,i,a),this.output=[]}return _createClass(t,[{key:"run",value:function(){var t=this,e=this.context,r=e.t;e.node.specifiers.map(function(e){r.isImportDefaultSpecifier(e)?(t.hasDefaultImportSpecifier=!0,t.transformDefaultSpecifier(e)):r.isImportSpecifier(e)&&t.transformSpecifier(e)}),this.hasDefaultImportSpecifier&&this.output.push(this.generateDefaultExportObject())}}]),t}();module.exports=function(t){var e=t.types;return{visitor:{ImportDeclaration:function(t,r){var n=t.node;if(utils_1.getFinalPath(n.source.value).includes("*")){var i=new ImportDeclarationHandler({path:t,state:r,t:e});i.run(),t.replaceWithMultiple(i.output)}}}}};
