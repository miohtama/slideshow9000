(function(j){typeof define==="function"?define(function(){j()}):j()})(function(j){if(!Function.prototype.bind){var n=Array.prototype.slice;Function.prototype.bind=function(){function c(){if(this instanceof c){var d=Object.create(b.prototype);b.apply(d,a.concat(n.call(arguments)));return d}else return b.call.apply(b,a.concat(n.call(arguments)))}var b=this;if(typeof b.apply!=="function"||typeof b.call!=="function")return new TypeError;var a=n.call(arguments);c.length=typeof b==="function"?Math.max(b.length-
a.length,0):0;return c}}var l=Function.prototype.call,f=Object.prototype,h=l.bind(f.hasOwnProperty),q,r,o,p,m;if(m=h(f,"__defineGetter__"))q=l.bind(f.__defineGetter__),r=l.bind(f.__defineSetter__),o=l.bind(f.__lookupGetter__),p=l.bind(f.__lookupSetter__);if(!Array.isArray)Array.isArray=function(c){return Object.prototype.toString.call(c)==="[object Array]"};if(!Array.prototype.forEach)Array.prototype.forEach=function(c,b){for(var a=+this.length,d=0;d<a;d++)d in this&&c.call(b,this[d],d,this)};if(!Array.prototype.map)Array.prototype.map=
function(c,b){var a=+this.length;if(typeof c!=="function")throw new TypeError;for(var d=Array(a),e=0;e<a;e++)e in this&&(d[e]=c.call(b,this[e],e,this));return d};if(!Array.prototype.filter)Array.prototype.filter=function(c,b){for(var a=[],d=0;d<this.length;d++)c.call(b,this[d])&&a.push(this[d]);return a};if(!Array.prototype.every)Array.prototype.every=function(c,b){for(var a=0;a<this.length;a++)if(!c.call(b,this[a]))return!1;return!0};if(!Array.prototype.some)Array.prototype.some=function(c,b){for(var a=
0;a<this.length;a++)if(c.call(b,this[a]))return!0;return!1};if(!Array.prototype.reduce)Array.prototype.reduce=function(c){var b=+this.length;if(typeof c!=="function")throw new TypeError;if(b===0&&arguments.length===1)throw new TypeError;var a=0;if(arguments.length>=2)var d=arguments[1];else{do{if(a in this){d=this[a++];break}if(++a>=b)throw new TypeError;}while(1)}for(;a<b;a++)a in this&&(d=c.call(null,d,this[a],a,this));return d};if(!Array.prototype.reduceRight)Array.prototype.reduceRight=function(c){var b=
+this.length;if(typeof c!=="function")throw new TypeError;if(b===0&&arguments.length===1)throw new TypeError;var a;b-=1;if(arguments.length>=2)a=arguments[1];else{do{if(b in this){a=this[b--];break}if(--b<0)throw new TypeError;}while(1)}for(;b>=0;b--)b in this&&(a=c.call(null,a,this[b],b,this));return a};if(!Array.prototype.indexOf)Array.prototype.indexOf=function(c,b){var a=this.length;if(!a)return-1;var d=b||0;if(d>=a)return-1;for(d<0&&(d+=a);d<a;d++)if(d in this&&c===this[d])return d;return-1};
if(!Array.prototype.lastIndexOf)Array.prototype.lastIndexOf=function(c,b){var a=this.length;if(!a)return-1;var d=b||a;d<0&&(d+=a);for(d=Math.min(d,a-1);d>=0;d--)if(d in this&&c===this[d])return d;return-1};if(!Object.getPrototypeOf)Object.getPrototypeOf=function(c){return c.__proto__||c.constructor.prototype};if(!Object.getOwnPropertyDescriptor)Object.getOwnPropertyDescriptor=function(c,b){if(typeof c!=="object"&&typeof c!=="function"||c===null)throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object: "+
c);if(!h(c,b))return j;var a,d,e;a={enumerable:!0,configurable:!0};if(m){var u=c.__proto__;c.__proto__=f;d=o(c,b);e=p(c,b);c.__proto__=u;if(d||e){if(d)a.get=d;if(e)a.set=e;return a}}a.value=c[b];return a};if(!Object.getOwnPropertyNames)Object.getOwnPropertyNames=function(c){return Object.keys(c)};if(!Object.create)Object.create=function(c,b){var a;if(c===null)a={__proto__:null};else{if(typeof c!=="object")throw new TypeError("typeof prototype["+typeof c+"] != 'object'");a=function(){};a.prototype=
c;a=new a;a.__proto__=c}typeof b!=="undefined"&&Object.defineProperties(a,b);return a};if(!Object.defineProperty)Object.defineProperty=function(c,b,a){if(typeof c!=="object"&&typeof c!=="function")throw new TypeError("Object.defineProperty called on non-object: "+c);if(typeof a!=="object"||a===null)throw new TypeError("Property description must be an object: "+a);if(h(a,"value")){if(m&&(o(c,b)||p(c,b)))c.__proto__=f,delete c[b];c[b]=a.value}else{if(!m)throw new TypeError("getters & setters can not be defined on this javascript engine");
h(a,"get")&&q(c,b,a.get);h(a,"set")&&r(c,b,a.set)}return c};if(!Object.defineProperties)Object.defineProperties=function(c,b){for(var a in b)h(b,a)&&Object.defineProperty(c,a,b[a]);return c};if(!Object.seal)Object.seal=function(c){return c};if(!Object.freeze)Object.freeze=function(c){return c};try{Object.freeze(function(){})}catch(z){Object.freeze=function(c){return function(b){return typeof b==="function"?b:c(b)}}(Object.freeze)}if(!Object.preventExtensions)Object.preventExtensions=function(c){return c};
if(!Object.isSealed)Object.isSealed=function(){return!1};if(!Object.isFrozen)Object.isFrozen=function(){return!1};if(!Object.isExtensible)Object.isExtensible=function(){return!0};if(!Object.keys){var s=!0,t=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],v=t.length,w;for(w in{toString:null})s=!1;Object.keys=function b(a){if(typeof a!=="object"&&typeof a!=="function"||a===null)throw new TypeError("Object.keys called on a non-object");var b=
[],d;for(d in a)h(a,d)&&b.push(d);if(s)for(d=0;d<v;d++){var e=t[d];h(a,e)&&b.push(e)}return b}}if(!Date.prototype.toISOString)Date.prototype.toISOString=function(){return this.getUTCFullYear()+"-"+(this.getUTCMonth()+1)+"-"+this.getUTCDate()+"T"+this.getUTCHours()+":"+this.getUTCMinutes()+":"+this.getUTCSeconds()+"Z"};if(!Date.now)Date.now=function(){return(new Date).getTime()};if(!Date.prototype.toJSON)Date.prototype.toJSON=function(){if(typeof this.toISOString!=="function")throw new TypeError;return this.toISOString()};
isNaN(Date.parse("T00:00"))&&(Date=function(b){var a=function(d,k,e,g,f,h,j){var i=arguments.length;if(this instanceof b)return i=i===1&&String(d)===d?new b(a.parse(d)):i>=7?new b(d,k,e,g,f,h,j):i>=6?new b(d,k,e,g,f,h):i>=5?new b(d,k,e,g,f):i>=4?new b(d,k,e,g):i>=3?new b(d,k,e):i>=2?new b(d,k):i>=1?new b(d):new b,i.constructor=a,i;return b.apply(this,arguments)},d=RegExp("^(?:((?:[+-]\\d\\d)?\\d\\d\\d\\d)(?:-(\\d\\d)(?:-(\\d\\d))?)?)?(?:T(\\d\\d):(\\d\\d)(?::(\\d\\d)(?:\\.(\\d\\d\\d))?)?)?(?:Z|([+-])(\\d\\d):(\\d\\d))?$"),
e;for(e in b)a[e]=b[e];a.now=b.now;a.UTC=b.UTC;a.prototype=b.prototype;a.prototype.constructor=a;a.parse=function(a){var e=d.exec(a);if(e){e.shift();for(var f=e[0]===j,g=0;g<10;g++)g!==7&&(e[g]=+(e[g]||(g<3?1:0)),g===1&&e[g]--);if(f)return((e[3]*60+e[4])*60+e[5])*1E3+e[6];f=(e[8]*60+e[9])*6E4;e[6]==="-"&&(f=-f);return b.UTC.apply(this,e.slice(0,7))+f}return b.parse.apply(this,arguments)};return a}(Date));if(!String.prototype.trim){var x=/^\s\s*/,y=/\s\s*$/;String.prototype.trim=function(){return String(this).replace(x,
"").replace(y,"")}}});

