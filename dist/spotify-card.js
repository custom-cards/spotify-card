/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function e(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */}const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(e,t,i=null)=>{for(;t!==i;){const i=t.nextSibling;e.removeChild(t),t=i}},n=`{{lit-${String(Math.random()).slice(2)}}}`,s=`\x3c!--${n}--\x3e`,a=new RegExp(`${n}|${s}`);class r{constructor(e,t){this.parts=[],this.element=t;const i=[],s=[],r=document.createTreeWalker(t.content,133,null,!1);let l=0,h=-1,p=0;const{strings:u,values:{length:g}}=e;for(;p<g;){const e=r.nextNode();if(null!==e){if(h++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:i}=t;let n=0;for(let e=0;e<i;e++)o(t[e].name,"$lit$")&&n++;for(;n-- >0;){const t=u[p],i=d.exec(t)[2],n=i.toLowerCase()+"$lit$",s=e.getAttribute(n);e.removeAttribute(n);const r=s.split(a);this.parts.push({type:"attribute",index:h,name:i,strings:r}),p+=r.length-1}}"TEMPLATE"===e.tagName&&(s.push(e),r.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(n)>=0){const n=e.parentNode,s=t.split(a),r=s.length-1;for(let t=0;t<r;t++){let i,a=s[t];if(""===a)i=c();else{const e=d.exec(a);null!==e&&o(e[2],"$lit$")&&(a=a.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),i=document.createTextNode(a)}n.insertBefore(i,e),this.parts.push({type:"node",index:++h})}""===s[r]?(n.insertBefore(c(),e),i.push(e)):e.data=s[r],p+=r}}else if(8===e.nodeType)if(e.data===n){const t=e.parentNode;null!==e.previousSibling&&h!==l||(h++,t.insertBefore(c(),e)),l=h,this.parts.push({type:"node",index:h}),null===e.nextSibling?e.data="":(i.push(e),h--),p++}else{let t=-1;for(;-1!==(t=e.data.indexOf(n,t+1));)this.parts.push({type:"node",index:-1}),p++}}else r.currentNode=s.pop()}for(const e of i)e.parentNode.removeChild(e)}}const o=(e,t)=>{const i=e.length-t.length;return i>=0&&e.slice(i)===t},l=e=>-1!==e.index,c=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function h(e,t){const{element:{content:i},parts:n}=e,s=document.createTreeWalker(i,133,null,!1);let a=u(n),r=n[a],o=-1,l=0;const c=[];let d=null;for(;s.nextNode();){o++;const e=s.currentNode;for(e.previousSibling===d&&(d=null),t.has(e)&&(c.push(e),null===d&&(d=e)),null!==d&&l++;void 0!==r&&r.index===o;)r.index=null!==d?-1:r.index-l,a=u(n,a),r=n[a]}c.forEach(e=>e.parentNode.removeChild(e))}const p=e=>{let t=11===e.nodeType?0:1;const i=document.createTreeWalker(e,133,null,!1);for(;i.nextNode();)t++;return t},u=(e,t=-1)=>{for(let i=t+1;i<e.length;i++){const t=e[i];if(l(t))return i}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const g=new WeakMap,v=e=>"function"==typeof e&&g.has(e),f={},m={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class y{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(const i of this.__parts)void 0!==i&&i.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),i=[],n=this.template.parts,s=document.createTreeWalker(e,133,null,!1);let a,r=0,o=0,c=s.nextNode();for(;r<n.length;)if(a=n[r],l(a)){for(;o<a.index;)o++,"TEMPLATE"===c.nodeName&&(i.push(c),s.currentNode=c.content),null===(c=s.nextNode())&&(s.currentNode=i.pop(),c=s.nextNode());if("node"===a.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(c.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,a.name,a.strings,this.options));r++}else this.__parts.push(void 0),r++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const _=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:e=>e}),w=` ${n} `;class S{constructor(e,t,i,n){this.strings=e,this.values=t,this.type=i,this.processor=n}getHTML(){const e=this.strings.length-1;let t="",i=!1;for(let a=0;a<e;a++){const e=this.strings[a],r=e.lastIndexOf("\x3c!--");i=(r>-1||i)&&-1===e.indexOf("--\x3e",r+1);const o=d.exec(e);t+=null===o?e+(i?w:s):e.substr(0,o.index)+o[1]+o[2]+"$lit$"+o[3]+n}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");let t=this.getHTML();return void 0!==_&&(t=_.createHTML(t)),e.innerHTML=t,e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const b=e=>null===e||!("object"==typeof e||"function"==typeof e),C=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class x{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let e=0;e<i.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new P(this)}_getValue(){const e=this.strings,t=e.length-1,i=this.parts;if(1===t&&""===e[0]&&""===e[1]){const e=i[0].value;if("symbol"==typeof e)return String(e);if("string"==typeof e||!C(e))return e}let n="";for(let s=0;s<t;s++){n+=e[s];const t=i[s];if(void 0!==t){const e=t.value;if(b(e)||!C(e))n+="string"==typeof e?e:String(e);else for(const t of e)n+="string"==typeof t?t:String(t)}}return n+=e[t],n}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class P{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===f||b(e)&&e===this.value||(this.value=e,v(e)||(this.committer.dirty=!0))}commit(){for(;v(this.value);){const e=this.value;this.value=f,e(this)}this.value!==f&&this.committer.commit()}}class ${constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(c()),this.endNode=e.appendChild(c())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=c()),e.__insert(this.endNode=c())}insertAfterPart(e){e.__insert(this.startNode=c()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(null===this.startNode.parentNode)return;for(;v(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=f,e(this)}const e=this.__pendingValue;e!==f&&(b(e)?e!==this.value&&this.__commitText(e):e instanceof S?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):C(e)?this.__commitIterable(e):e===m?(this.value=m,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,i="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof y&&this.value.template===t)this.value.update(e.values);else{const i=new y(t,e.processor,this.options),n=i._clone();i.update(e.values),this.__commitNode(n),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let i,n=0;for(const s of e)i=t[n],void 0===i&&(i=new $(this.options),t.push(i),0===n?i.appendIntoPart(this):i.insertAfterPart(t[n-1])),i.setValue(s),i.commit(),n++;n<t.length&&(t.length=n,this.clear(i&&i.endNode))}clear(e=this.startNode){i(this.startNode.parentNode,e.nextSibling,this.endNode)}}class k{constructor(e,t,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this.__pendingValue=e}commit(){for(;v(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=f,e(this)}if(this.__pendingValue===f)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=f}}class M extends x{constructor(e,t,i){super(e,t,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new D(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class D extends P{}let N=!1;(()=>{try{const e={get capture(){return N=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}})();class E{constructor(e,t,i){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;v(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=f,e(this)}if(this.__pendingValue===f)return;const e=this.__pendingValue,t=this.value,i=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),n=null!=e&&(null==t||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),n&&(this.__options=T(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=f}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const T=e=>e&&(N?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function V(e){let t=A.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},A.set(e.type,t));let i=t.stringsArray.get(e.strings);if(void 0!==i)return i;const s=e.strings.join(n);return i=t.keyString.get(s),void 0===i&&(i=new r(e,e.getTemplateElement()),t.keyString.set(s,i)),t.stringsArray.set(e.strings,i),i}const A=new Map,O=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const z=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(e,t,i,n){const s=t[0];if("."===s){return new M(e,t.slice(1),i).parts}if("@"===s)return[new E(e,t.slice(1),n.eventContext)];if("?"===s)return[new k(e,t.slice(1),i)];return new x(e,t,i).parts}handleTextExpression(e){return new $(e)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.3.0");const H=(e,...t)=>new S(e,t,"html",z)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,L=(e,t)=>`${e}--${t}`;let U=!0;void 0===window.ShadyCSS?U=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),U=!1);const j=e=>t=>{const i=L(t.type,e);let s=A.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},A.set(i,s));let a=s.stringsArray.get(t.strings);if(void 0!==a)return a;const o=t.strings.join(n);if(a=s.keyString.get(o),void 0===a){const i=t.getTemplateElement();U&&window.ShadyCSS.prepareTemplateDom(i,e),a=new r(t,i),s.keyString.set(o,a)}return s.stringsArray.set(t.strings,a),a},R=["html","svg"],F=new Set,Y=(e,t,i)=>{F.add(e);const n=i?i.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:a}=s;if(0===a)return void window.ShadyCSS.prepareTemplateStyles(n,e);const r=document.createElement("style");for(let e=0;e<a;e++){const t=s[e];t.parentNode.removeChild(t),r.textContent+=t.textContent}(e=>{R.forEach(t=>{const i=A.get(L(t,e));void 0!==i&&i.keyString.forEach(e=>{const{element:{content:t}}=e,i=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{i.add(e)}),h(e,i)})})})(e);const o=n.content;i?function(e,t,i=null){const{element:{content:n},parts:s}=e;if(null==i)return void n.appendChild(t);const a=document.createTreeWalker(n,133,null,!1);let r=u(s),o=0,l=-1;for(;a.nextNode();)for(l++,a.currentNode===i&&(o=p(t),i.parentNode.insertBefore(t,i));-1!==r&&s[r].index===l;){if(o>0){for(;-1!==r;)s[r].index+=o,r=u(s,r);return}r=u(s,r)}}(i,r,o.firstChild):o.insertBefore(r,o.firstChild),window.ShadyCSS.prepareTemplateStyles(n,e);const l=o.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(i){o.insertBefore(r,o.firstChild);const e=new Set;e.add(r),h(i,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const I={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},W=(e,t)=>t!==e&&(t==t||e==e),q={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:W};class G extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,i)=>{const n=this._attributeNameForProperty(i,t);void 0!==n&&(this._attributeToPropertyMap.set(n,i),e.push(n))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=q){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const i="symbol"==typeof e?Symbol():"__"+e,n=this.getPropertyDescriptor(e,i,t);void 0!==n&&Object.defineProperty(this.prototype,e,n)}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(n){const s=this[e];this[t]=n,this.requestUpdateInternal(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||q}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const i of t)this.createProperty(i,e[i])}}static _attributeNameForProperty(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=W){return i(e,t)}static _propertyValueFromAttribute(e,t){const i=t.type,n=t.converter||I,s="function"==typeof n?n:n.fromAttribute;return s?s(e,i):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const i=t.type,n=t.converter;return(n&&n.toAttribute||I.toAttribute)(e,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=q){const n=this.constructor,s=n._attributeNameForProperty(e,i);if(void 0!==s){const e=n._propertyValueToAttribute(t,i);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(s):this.setAttribute(s,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const i=this.constructor,n=i._attributeToPropertyMap.get(e);if(void 0!==n){const e=i.getPropertyOptions(n);this._updateState=16|this._updateState,this[n]=i._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}requestUpdateInternal(e,t,i){let n=!0;if(void 0!==e){const s=this.constructor;i=i||s.getPropertyOptions(e),s._valueHasChanged(this[e],t,i.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==i.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,i))):n=!1}!this._hasRequestedUpdate&&n&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this.requestUpdateInternal(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const e=this.performUpdate();return null!=e&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(t){throw e=!1,this._markUpdated(),t}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}}G.finalized=!0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const B=e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:n}=t;return{kind:i,elements:n,finisher(t){window.customElements.define(e,t)}}})(e,t),Z=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?Object.assign(Object.assign({},t),{finisher(i){i.createProperty(t.key,e)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}};function J(e){return(t,i)=>void 0!==i?((e,t,i)=>{t.constructor.createProperty(i,e)})(e,t,i):Z(e,t)}function K(e){return J({attribute:!1,hasChanged:null==e?void 0:e.hasChanged})}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const Q=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol();class ee{constructor(e,t){if(t!==X)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(Q?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const te=(e,...t)=>{const i=t.reduce((t,i,n)=>t+(e=>{if(e instanceof ee)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+e[n+1],e[0]);return new ee(i,X)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.4.0");const ie={};class ne extends G{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const e=this.getStyles();if(Array.isArray(e)){const t=(e,i)=>e.reduceRight((e,i)=>Array.isArray(i)?t(i,e):(e.add(i),e),i),i=t(e,new Set),n=[];i.forEach(e=>n.unshift(e)),this._styles=n}else this._styles=void 0===e?[]:[e];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!Q){const t=Array.prototype.slice.call(e.cssRules).reduce((e,t)=>e+t.cssText,"");return new ee(String(t),X)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?Q?this.renderRoot.adoptedStyleSheets=e.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){const t=this.render();super.update(e),t!==ie&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){return ie}}ne.finalized=!0,ne.render=(e,t,n)=>{if(!n||"object"!=typeof n||!n.scopeName)throw new Error("The `scopeName` option is required.");const s=n.scopeName,a=O.has(t),r=U&&11===t.nodeType&&!!t.host,o=r&&!F.has(s),l=o?document.createDocumentFragment():t;if(((e,t,n)=>{let s=O.get(t);void 0===s&&(i(t,t.firstChild),O.set(t,s=new $(Object.assign({templateFactory:V},n))),s.appendInto(t)),s.setValue(e),s.commit()})(e,l,Object.assign({templateFactory:j(s)},n)),o){const e=O.get(l);O.delete(l);const n=e.value instanceof y?e.value.template:void 0;Y(s,l,n),i(t,t.firstChild),t.appendChild(l),O.set(t,e)}!a&&r&&window.ShadyCSS.styleElement(t.host)};var se,ae,re;function oe(e){return"currently_playing_type"in e}!function(e){e.Grid="grid",e.List="list"}(se||(se={})),function(e){e.default="default",e.featured="featured",e.discover_weekly="discover-weekly"}(ae||(ae={})),function(e){e[e.Name=0]="Name",e[e.Account=1]="Account",e[e.Spotify_Entity=2]="Spotify_Entity",e[e.Country_Code=3]="Country_Code",e[e.Limit=4]="Limit",e[e.Playlist_Type=5]="Playlist_Type",e[e.Always_Play_Random_Song=6]="Always_Play_Random_Song",e[e.Height=7]="Height",e[e.Display_Style=8]="Display_Style",e[e.Grid_Covers_Per_Row=9]="Grid_Covers_Per_Row",e[e.Grid_Center_Covers=10]="Grid_Center_Covers",e[e.Hide_Warning=11]="Hide_Warning",e[e.Default_Device=12]="Default_Device",e[e.Filter_Devices=13]="Filter_Devices"}(re||(re={}));var le=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,ce="[^\\s]+",de=/\[([^]*?)\]/gm;function he(e,t){for(var i=[],n=0,s=e.length;n<s;n++)i.push(e[n].substr(0,t));return i}var pe=function(e){return function(t,i){var n=i[e].map((function(e){return e.toLowerCase()})).indexOf(t.toLowerCase());return n>-1?n:null}};function ue(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];for(var n=0,s=t;n<s.length;n++){var a=s[n];for(var r in a)e[r]=a[r]}return e}var ge=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],ve=["January","February","March","April","May","June","July","August","September","October","November","December"],fe=he(ve,3),me={dayNamesShort:he(ge,3),dayNames:ge,monthNamesShort:fe,monthNames:ve,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}},ye=ue({},me),_e=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},we={D:function(e){return String(e.getDate())},DD:function(e){return _e(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return _e(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return _e(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return _e(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return _e(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return _e(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return _e(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return _e(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return _e(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return _e(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return _e(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+_e(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+_e(Math.floor(Math.abs(t)/60),2)+":"+_e(Math.abs(t)%60,2)}},Se=function(e){return+e-1},be=[null,"[1-9]\\d?"],Ce=[null,ce],xe=["isPm",ce,function(e,t){var i=e.toLowerCase();return i===t.amPm[0]?0:i===t.amPm[1]?1:null}],Pe=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(e){var t=(e+"").match(/([+-]|\d\d)/gi);if(t){var i=60*+t[1]+parseInt(t[2],10);return"+"===t[0]?i:-i}return 0}],$e=(pe("monthNamesShort"),pe("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var ke=function(e,t,i){if(void 0===t&&(t=$e.default),void 0===i&&(i={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var n=[];t=(t=$e[t]||t).replace(de,(function(e,t){return n.push(t),"@@@"}));var s=ue(ue({},ye),i);return(t=t.replace(le,(function(t){return we[t](e,s)}))).replace(/@@@/g,(function(){return n.shift()}))},Me=(function(){try{(new Date).toLocaleDateString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}}(),{version:"Version",description:"A custom card for displaying Spotify-Playlist and starting playback",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_missing_spotcast:"Spotcast integration has to be installed for this component to work",show_missing_spotify:"Spotify integration has to be installed for playback information",choose_player:"Choose player"}),De={general:"General",general_description:"General settings for this card",appearance:"Appearance",appearance_description:"Customize the style, icon, etc",advanced:"Advanced",advanced_description:"Customize advanced settings",hide_warning:"Hide warnings",playlist_type:"Playlist Type",limit:"Amount of playlists shown",height:"Height of card",country_code:"Country Code for featured playlists",always_play_random_song:"Always play random song when starting playback",title:"Title of card",display_style:"Display Style",grid_covers_per_row:"Number of covers per row",grid_center_covers:"Center Covers",account:"Account",filter_out_cast_devices:"Filter out chromecast devices",spotify_entity:"Spotify media player entity",default_device:"Default device name",filter_devices:"Hide devices (see documentation under 'Advanced usage')"},Ne={common:Me,settings:De},Ee={version:"Version",description:"Eine Karte um Spotify-Playlist anzuzeigen und abzuspielen",invalid_configuration:"Ungültige Konfiguration",show_warning:"Warnung",show_missing_spotcast:"Die Spotcast-Integration muss installiert sein, damit diese Karte funktioniert",show_missing_spotify:"Die Spotify-Integration muss installiert sein, damit der Spotify-Status angezeigt werden kann"},Te={general:"Generell",general_description:"Generelle Einstellungen",appearance:"Aussehen",appearance_description:"Passe den Stil und anderes an",hide_warning:"Verstecke Warnhinweise",playlist_type:"Playlist Typ",limit:"Anzahl an angezeigten Playlisten",height:"Höhe der Karte",country_code:"Länder-Code für die Featured-Playlist",always_play_random_song:"Spiele immer einen zufälligen Song beim Starten der Wiedergabe ab",title:"Titel der Karte",display_style:"Anzeige-Stil",grid_covers_per_row:"Number of covers per row",account:"Account",filter_out_cast_devices:"Filter out chromecast devices",spotify_entity:"Spotify media player entity",default_device:"Default device name"},Ve={common:Ee,settings:Te},Ae={version:"Version",description:"A custom card for displaying Spotify-Playlist and starting playback",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_missing_spotcast:"Spotcast integration has to be installed for this component to work",show_missing_spotify:"Spotify integration has to be installed for playback information"},Oe={general:"General",general_description:"General settings for this card",appearance:"Appearance",appearance_description:"Customize the style, icon, etc",hide_warning:"Hide warnings",playlist_type:"Playlist Type",limit:"Amount of playlists shown",height:"Height of card",country_code:"Country Code for featured playlists",always_play_random_song:"Always play random song when starting playback",title:"Title of card",display_style:"Display Style",grid_covers_per_row:"Number of covers per row",account:"Account",filter_out_cast_devices:"Filter out chromecast devices",spotify_entity:"Spotify media player entity",default_device:"Default device name"},ze={common:Ae,settings:Oe};const He={en:Object.freeze({__proto__:null,common:Me,settings:De,default:Ne}),de:Object.freeze({__proto__:null,common:Ee,settings:Te,default:Ve}),se:Object.freeze({__proto__:null,common:Ae,settings:Oe,default:ze})};function Le(e,t="",i=""){const n=e.split(".")[0],s=e.split(".")[1],a=(localStorage.getItem("selectedLanguage")||navigator.language.split("-")[0]||"en").replace(/['"]+/g,"").replace("-","_");let r;try{r=He[a][n][s]}catch(e){r=He.en[n][s]}return void 0===r&&(r=He.en[n][s]),""!==t&&""!==i&&(r=r.replace(t,i)),r}const Ue={general:{icon:"tune",name:Le("settings.general"),secondary:Le("settings.general_description"),show:!0},appearance:{icon:"palette",name:Le("settings.appearance"),secondary:Le("settings.appearance_description"),show:!1},advanced:{icon:"pencil",name:Le("settings.advanced"),secondary:Le("settings.advanced_description"),show:!1}};let je=class extends ne{constructor(){super(...arguments),this.accounts=[],this.chromecast_devices=[]}async connectedCallback(){super.connectedCallback();const e=await this.hass.callWS({type:"spotcast/accounts"});this.accounts=e;const t=await this.hass.callWS({type:"spotcast/castdevices"});this.chromecast_devices=null==t?void 0:t.map(e=>e.friendly_name)}setConfig(e){this.config=e}getMediaPlayerEntities(){return Object.values(this.hass.states).filter(e=>e.entity_id.match("media_player[.]")).map(e=>e.entity_id)}_toggleOption(e){this._toggleThing(e,Ue)}_toggleThing(e,t){const i=!t[e.target.option].show;for(const[e]of Object.entries(t))t[e].show=!1;t[e.target.option].show=i,this._toggle=!this._toggle}valueChanged(e){if(!this.config||!this.hass||null===e.target.offsetParent)return;const{target:t}=e;if(!t.value||this["_"+t.configValue]!==t.value){if(t.configValue)if(!1===t.checked||""===t.value){const e=Object.assign({},this.config);delete e[t.configValue],this.config=e}else{let e=t.value;"height"==t.configValue?e=Number(e):"filter_devices"==t.configValue&&(e=e.split(",").map(e=>e.trim()).filter(e=>""!=e)),this.config=Object.assign(Object.assign({},this.config),{[t.configValue]:void 0!==t.checked?t.checked:e})}!function(e,t,i,n){n=n||{},i=null==i?{}:i;var s=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});s.detail=i,e.dispatchEvent(s)}(this,"config-changed",{config:this.config})}}getValue(e){var t,i,n,s,a,r,o,l,c,d,h,p,u,g,v,f,m,y,_,w,S,b,C,x,P,$,k,M,D;switch(e){case re.Name:return null!==(i=null===(t=this.config)||void 0===t?void 0:t.name)&&void 0!==i?i:"";case re.Account:return null!==(s=null===(n=this.config)||void 0===n?void 0:n.account)&&void 0!==s?s:"default";case re.Spotify_Entity:const e=this.getMediaPlayerEntities().filter(e=>e.includes("spotify"));return null!==(r=null===(a=this.config)||void 0===a?void 0:a.spotify_entity)&&void 0!==r?r:e.length>0?e[0]:"";case re.Country_Code:return null!==(l=null===(o=this.config)||void 0===o?void 0:o.country_code)&&void 0!==l?l:"";case re.Limit:return null!==(d=null===(c=this.config)||void 0===c?void 0:c.limit)&&void 0!==d?d:10;case re.Playlist_Type:return null!==(p=null===(h=this.config)||void 0===h?void 0:h.playlist_type)&&void 0!==p?p:"default";case re.Always_Play_Random_Song:return null!==(g=null===(u=this.config)||void 0===u?void 0:u.always_play_random_song)&&void 0!==g&&g;case re.Height:return null!==(f=null===(v=this.config)||void 0===v?void 0:v.height)&&void 0!==f?f:"";case re.Display_Style:return null!==(y=null===(m=this.config)||void 0===m?void 0:m.display_style)&&void 0!==y?y:"list";case re.Grid_Covers_Per_Row:return null!==(w=null===(_=this.config)||void 0===_?void 0:_.grid_covers_per_row)&&void 0!==w?w:5;case re.Grid_Center_Covers:return null!==(b=null===(S=this.config)||void 0===S?void 0:S.grid_center_covers)&&void 0!==b&&b;case re.Hide_Warning:return null!==(x=null===(C=this.config)||void 0===C?void 0:C.hide_warning)&&void 0!==x&&x;case re.Default_Device:return null!==($=null===(P=this.config)||void 0===P?void 0:P.default_device)&&void 0!==$?$:"";case re.Filter_Devices:return null!==(D=null===(M=null===(k=this.config)||void 0===k?void 0:k.filter_devices)||void 0===M?void 0:M.toString())&&void 0!==D?D:""}}renderGeneral(){const e=this.getMediaPlayerEntities();return H`
      <div class="values">
        <div>
          <paper-dropdown-menu
            label=${Le("settings.account")}
            @value-changed=${this.valueChanged}
            .configValue=${"account"}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${this.accounts.indexOf(this.getValue(re.Account))}
            >
              ${this.accounts.map(e=>H` <paper-item>${e}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <paper-dropdown-menu
            label=${Le("settings.spotify_entity")}
            @value-changed=${this.valueChanged}
            .configValue=${"spotify_entity"}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${e.indexOf(this.getValue(re.Spotify_Entity))}
            >
              ${e.map(e=>H` <paper-item>${e}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <paper-dropdown-menu
            label=${Le("settings.playlist_type")}
            @value-changed=${this.valueChanged}
            .configValue=${"playlist_type"}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${Object.values(ae).indexOf(this.getValue(re.Playlist_Type))}
            >
              ${Object.values(ae).map(e=>H` <paper-item>${e}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${Le("settings.limit")}</div>
          <paper-slider
            .value=${this.getValue(re.Limit)}
            .configValue=${"limit"}
            @value-changed=${this.valueChanged}
            max="50"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <paper-input
            label=${Le("settings.height")}
            .value=${this.getValue(re.Height)}
            .configValue=${"height"}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-input
            label=${Le("settings.country_code")}
            .value=${this.getValue(re.Country_Code)}
            .configValue=${"country_code"}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <div>
          <ha-switch
            .checked=${this.getValue(re.Always_Play_Random_Song)}
            .configValue=${"always_play_random_song"}
            @change=${this.valueChanged}
            .id=${"always_play_random_song"}
          ></ha-switch>
          <label for=${"always_play_random_song"}>${Le("settings.always_play_random_song")}</label>
        </div>
        <div>
          <paper-input
            label=${Le("settings.default_device")}
            .value=${this.getValue(re.Default_Device)}
            .configValue=${"default_device"}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
      </div>
    `}renderAppearance(){return H`
      <div class="values">
        <div>
          <ha-switch
            .checked=${this.getValue(re.Hide_Warning)}
            .configValue=${"hide_warning"}
            @change=${this.valueChanged}
            .id=${"hide_warning"}
          ></ha-switch>
          <label for=${"hide_warning"}>${Le("settings.hide_warning")}</label>
        </div>
        <div>
          <paper-input
            label=${Le("settings.title")}
            .value=${this.getValue(re.Name)}
            .configValue=${"name"}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-dropdown-menu
            label=${Le("settings.display_style")}
            @value-changed=${this.valueChanged}
            .configValue=${"display_style"}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${Object.values(se).indexOf(this.getValue(re.Display_Style))}
            >
              ${Object.values(se).map(e=>H` <paper-item>${e}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${Le("settings.grid_covers_per_row")}</div>
          <paper-slider
            .value=${this.getValue(re.Grid_Covers_Per_Row)}
            .configValue=${"grid_covers_per_row"}
            @value-changed=${this.valueChanged}
            max="10"
            min="1"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <ha-switch
            .checked=${this.getValue(re.Grid_Center_Covers)}
            .configValue=${"grid_center_covers"}
            @change=${this.valueChanged}
            .id=${"grid_center_covers"}
          ></ha-switch>
          <label for=${"grid_center_covers"}>${Le("settings.grid_center_covers")}</label>
        </div>
      </div>
    `}renderAdvanced(){return H`
      <div class="values">
        <div>
          <paper-input
            label=${Le("settings.filter_devices")}
            .value=${this.getValue(re.Filter_Devices)}
            .configValue=${"filter_devices"}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
      </div>
    `}render(){return this.hass?H`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${"general"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Ue.general.icon}></ha-icon>
            <div class="title">${Ue.general.name}</div>
          </div>
          <div class="secondary">${Ue.general.secondary}</div>
        </div>
        ${Ue.general.show?this.renderGeneral():""}
        <div class="option" @click=${this._toggleOption} .option=${"appearance"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Ue.appearance.icon}></ha-icon>
            <div class="title">${Ue.appearance.name}</div>
          </div>
          <div class="secondary">${Ue.appearance.secondary}</div>
        </div>
        ${Ue.appearance.show?this.renderAppearance():""}
        <div class="option" @click=${this._toggleOption} .option=${"advanced"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Ue.advanced.icon}></ha-icon>
            <div class="title">${Ue.advanced.name}</div>
          </div>
          <div class="secondary">${Ue.advanced.secondary}</div>
        </div>
        ${Ue.advanced.show?this.renderAdvanced():""}
      </div>
    `:H``}static get styles(){return te`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        background: var(--secondary-background-color);
      }

      .values > * {
        padding-top: 16px;
        padding-left: 16px;
        border-bottom: solid var(--divider-color) 2px;
      }

      .values > *:last-child {
        border-bottom: 0;
      }

      .dropdown {
        width: 40%;
      }

      .filter_grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        row-gap: 20px;
        padding-bottom: 10px;
      }

      .filter_grid > .filter_grid--title {
        grid-column: span 3;
      }

      ha-switch {
        padding-bottom: 8px;
      }

      paper-input {
        margin-top: -1em;
      }

      paper-slider {
        width: auto;
      }
    `}};e([J({type:Object})],je.prototype,"hass",void 0),e([K()],je.prototype,"config",void 0),e([K()],je.prototype,"_toggle",void 0),e([K()],je.prototype,"chromecast_devices",void 0),je=e([B("spotify-card-editor")],je);class Re{constructor(e){this.state_ttl=4e3,this.last_state_update_time=0,this.loading=!1,this.parent=e}is_loading(){return setTimeout(this.set_loading_off,100),this.loading}set_loading_off(){this.loading=!1}is_loaded(){return void 0!==this.parent.playlists.length}getPlaybackOptions(e){return{uri:e,force_playback:"playing"==this.parent.getSpotifyEntityState(),random_song:this.parent.config.always_play_random_song||!1,account:this.parent.config.account}}playUri(e){const t=this.getCurrentPlayer();if(!t){const t=this.parent.config.default_device;if(t){const i=this.parent.devices.filter(e=>e.name==t);if(i.length>0)return this.playUriOnConnectDevice(i[0].id,e);{const i=this.parent.chromecast_devices.filter(e=>e.friendly_name==t);if(i.length>0)return this.playUriOnCastDevice(i[0].friendly_name,e);throw new Error("Could not find default_device: "+t)}}throw new Error("No active device nor default device in settings")}this.playUriOnConnectDevice(t.id,e)}transferPlaybackToCastDevice(e){this.parent.hass.callService("spotcast","start",{device_name:e,force_playback:!0,account:this.parent.config.account})}transferPlaybackToConnectDevice(e){this.parent.hass.callService("spotcast","start",{spotify_device_id:e,force_playback:!0,account:this.parent.config.account})}playUriOnCastDevice(e,t){const i=Object.assign(Object.assign({},this.getPlaybackOptions(t)),{device_name:e});this.parent.hass.callService("spotcast","start",i)}playUriOnConnectDevice(e,t){const i=Object.assign(Object.assign({},this.getPlaybackOptions(t)),{spotify_device_id:e});this.parent.hass.callService("spotcast","start",i)}async updateState(){if(!((new Date).getTime()-this.last_state_update_time<this.state_ttl))try{this.loading=!0,await this.fetchDevices(),await this.fetchPlayer(),await this.fetchChromecasts(),this.last_state_update_time=(new Date).getTime()}catch(e){throw Error("updateState error: "+e)}finally{this.loading=!1}}getCurrentPlayer(){var e;return null===(e=this.parent.player)||void 0===e?void 0:e.device}async fetchPlayer(){const e={type:"spotcast/player",account:this.parent.config.account};try{this.parent.player=await this.parent.hass.callWS(e)}catch(e){throw Error("Failed to fetch player: "+e)}}async fetchDevices(){const e={type:"spotcast/devices",account:this.parent.config.account};try{const t=await this.parent.hass.callWS(e);this.parent.devices=t.devices}catch(e){throw Error("Failed to fetch devices: "+e)}}async fetchChromecasts(){try{this.parent.chromecast_devices=await this.parent.hass.callWS({type:"spotcast/castdevices"})}catch(e){throw this.parent.chromecast_devices=[],Error("Failed to fetch devices: "+e)}}async fetchPlaylists(){this.loading=!0;const e={type:"spotcast/playlists",playlist_type:this.parent.config.playlist_type||"",account:this.parent.config.account,limit:this.parent.config.limit};this.parent.config.country_code&&(e.country_code=this.parent.config.country_code);try{const t=await this.parent.hass.callWS(e);this.parent.playlists=t.items}catch(e){throw Error("Failed to fetch playlists: "+e)}finally{this.loading=!1}}}const Fe=e=>{let t=[];function i(i,n){e=n?i:Object.assign(Object.assign({},e),i);let s=t;for(let t=0;t<s.length;t++)s[t](e)}return{get state(){return e},action(t){function n(e){i(e,!1)}return function(){let i=[e];for(let e=0;e<arguments.length;e++)i.push(arguments[e]);let s=t.apply(this,i);if(null!=s)return s instanceof Promise?s.then(n):n(s)}},setState:i,subscribe:e=>(t.push(e),()=>{!function(e){let i=[];for(let n=0;n<t.length;n++)t[n]===e?e=null:i.push(t[n]);t=i}(e)})}},Ye=(e,t,i,n)=>{if(e[t])return e[t];let s,a=0,r=Fe();const o=()=>i(e).then(e=>r.setState(e,!0)),l=()=>o().catch(t=>{if(e.connected)throw t});return e[t]={get state(){return r.state},refresh:o,subscribe(t){a++,1===a&&(n&&(s=n(e,r)),e.addEventListener("ready",l),l());const i=r.subscribe(t);return void 0!==r.state&&setTimeout(()=>t(r.state),0),()=>{i(),a--,a||(s&&s.then(e=>{e()}),e.removeEventListener("ready",o))}}},e[t]},Ie=e=>e.sendMessagePromise({type:"get_states"});function We(e,t){if(void 0===e)return null;const{domain:i,service:n}=t.data;return{[i]:Object.assign({},e[i],{[n]:{description:"",fields:{}}})}}function qe(e,t){if(void 0===e)return null;const{domain:i,service:n}=t.data,s=e[i];if(!s||!(n in s))return null;const a={};return Object.keys(s).forEach(e=>{e!==n&&(a[e]=s[e])}),{[i]:a}}const Ge=e=>e.sendMessagePromise({type:"get_services"}),Be=(e,t)=>Promise.all([e.subscribeEvents(t.action(We),"service_registered"),e.subscribeEvents(t.action(qe),"service_removed")]).then(e=>()=>e.forEach(e=>e()));async function Ze(e){const t=await Ie(e),i={};for(let e=0;e<t.length;e++){const n=t[e];i[n.entity_id]=n}return i}const Je=(e,t)=>e.subscribeEvents(e=>function(e,t){const i=e.state;if(void 0===i)return;const{entity_id:n,new_state:s}=t.data;if(s)e.setState({[s.entity_id]:s});else{const t=Object.assign({},i);delete t[n],e.setState(t,!0)}}(t,e),"state_changed"),Ke=(e,t)=>(e=>Ye(e,"_ent",Ze,Je))(e).subscribe(t);var Qe;function Xe(e,t){if(!t||!oe(t)&&!oe(e)&&e.length!=t.length)return!0;for(const i in e)if(e[i].id!=t[i].id)return!0;return!1}function et(e,t){return!t||(e.state!=t.state||e.attributes.shuffle!=t.attributes.shuffle)}console.info(`%c  SPOTIFY-CARD \n%c  ${Le("common.version")} 2.2.1    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"spotify-card",name:"Spotify Card",description:Le("common.description"),preview:!0});let tt=Qe=class extends ne{constructor(){super(),this.playlists=[],this.devices=[],this.chromecast_devices=[],this._spotify_installed=!1,this._fetch_time_out=0,this.spotcast_connector=new Re(this)}static async getConfigElement(){return document.createElement("spotify-card-editor")}static getStubConfig(){return{}}setConfig(e){let t="";if(e.playlist_type&&!Object.values(ae).includes(e.playlist_type.toLowerCase())&&(t="playlist_type"),e.display_style&&!Object.values(se).includes(e.display_style.toLowerCase())&&(t="display_style"),e.show_error||""!=t)throw new Error(Le("common.invalid_configuration")+": "+t);this.config=e}connectedCallback(){super.connectedCallback(),this.doSubscribeEntities(),this.updateSpotcast()}doSubscribeEntities(){var e;(null===(e=this.hass)||void 0===e?void 0:e.connection)&&!this._unsubscribe_entitites&&this.isConnected&&(this._unsubscribe_entitites=Ke(this.hass.connection,e=>this.entitiesUpdated(e)))}entitiesUpdated(e){let t=!1;for(const i in e)i.startsWith("media_player")&&((i.startsWith("media_player.spotify")||i==this.config.spotify_entity)&&(this._spotify_installed=!0,this._spotify_state=e[i]),t=!0);t&&!document.hidden&&this.updateSpotcast()}updateSpotcast(){this._fetch_time_out&&clearTimeout(this._fetch_time_out),this._fetch_time_out=setTimeout(async()=>{this.hass&&this.isSpotcastInstalled()&&!this.spotcast_connector.is_loading()&&(await this.spotcast_connector.updateState(),await this.spotcast_connector.fetchPlaylists())},500)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe_entitites&&(this._unsubscribe_entitites(),this._unsubscribe_entitites=void 0)}updated(e){super.updated(e),this.updateComplete.then(()=>{for(const e of this.renderRoot.querySelectorAll("[data-spotify-image-url]")){const t=new Image;t.onload=function(t){var i;null===(i=e.firstElementChild)||void 0===i||i.replaceWith(t.srcElement)},e.dataset.spotifyImageUrl&&(t.src=e.dataset.spotifyImageUrl)}})}getDisplayStyle(){var e;return"grid"==(null===(e=this.config.display_style)||void 0===e?void 0:e.toLowerCase())?se.Grid:se.List}getPlayingState(){var e,t;return null!==(t="playing"==(null===(e=this._spotify_state)||void 0===e?void 0:e.state))&&void 0!==t&&t}getShuffleState(){var e,t;return null!==(t=null===(e=this.player)||void 0===e?void 0:e.shuffle_state)&&void 0!==t&&t}getSpotifyEntityState(){return this._spotify_state?this._spotify_state.state:""}isSpotcastInstalled(){var e,t;return!(!(null===(e=this.hass)||void 0===e?void 0:e.connection)||void 0===(t=this.hass.connection,Ye(t,"_srv",Ge,Be)).state.spotcast)}checkIfAllowedToShow(e){var t,i;const n=null!==(i=null===(t=this.config.filter_devices)||void 0===t?void 0:t.map(e=>new RegExp(e+"$")))&&void 0!==i?i:[];for(const t of n)if(t.test("name"in e?e.name:e.friendly_name))return!1;return!0}getDefaultDevice(){let[e,t]=this.getFilteredDevices();if(e=e.filter(e=>e.name==this.config.default_device),t=t.filter(e=>e.friendly_name==this.config.default_device),e.length>0||t.length>0)return this.config.default_device}getFilteredDevices(){return[this.devices.filter(this.checkIfAllowedToShow,this),this.chromecast_devices.filter(this.checkIfAllowedToShow,this)]}getPlaylists(){return this.playlists}isThisPlaylistPlaying(e){var t;return(null===(t=this._spotify_state)||void 0===t?void 0:t.attributes.media_playlist)===e.name}startUri(e,t){const i="loading",n=e.srcElement;"div"==(null==n?void 0:n.localName)?n.children[1].classList.add(i):"svg"==(null==n?void 0:n.localName)?n.parentElement.classList.add(i):"path"==(null==n?void 0:n.localName)?n.parentElement.parentElement.classList.add(i):"img"==(null==n?void 0:n.localName)?n.nextElementSibling.classList.add(i):"p"==(null==n?void 0:n.localName)?n.parentElement.children[1].classList.add(i):console.log(n),this.spotcast_connector.playUri(t)}onShuffleSelect(){var e,t;"playing"==(null===(e=this._spotify_state)||void 0===e?void 0:e.state)&&this.hass.callService("media_player","shuffle_set",{entity_id:this._spotify_state.entity_id,shuffle:!(null===(t=this.player)||void 0===t?void 0:t.shuffle_state)})}handlePlayPauseEvent(e,t){e.stopPropagation(),this._spotify_state&&this.hass.callService("media_player",t,{entity_id:this._spotify_state.entity_id})}spotifyDeviceSelected(e){if(this.spotcast_connector.getCurrentPlayer())return this.spotcast_connector.transferPlaybackToConnectDevice(e.id);const t=this.playlists[0];console.log("spotifyDeviceSelected playing first playlist"),this.spotcast_connector.playUriOnConnectDevice(e.id,t.uri)}chromecastDeviceSelected(e){if(this.spotcast_connector.getCurrentPlayer())return this.spotcast_connector.transferPlaybackToCastDevice(e.friendly_name);const t=this.playlists[0];console.log("chromecastDeviceSelected playing first playlist"),this.spotcast_connector.playUriOnCastDevice(e.friendly_name,t.uri)}getCurrentPlayer(){return this.spotcast_connector.getCurrentPlayer()}render(){var e,t,i;let n=H``;this.isSpotcastInstalled()||(n=this.showWarning(Le("common.show_missing_spotcast")));let s=H`<div>Loading...</div>`;if(this.spotcast_connector.is_loaded())switch(this.getDisplayStyle()){case se.Grid:s=this.generateGridView();break;default:s=this.generateListView()}return H`
      <ha-card tabindex="0" style="${this.config.height?`height: ${this.config.height}px`:""}"
        >${this.config.hide_warning?"":n}
        <div id="header">
          <div id="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559 168">
              <path
                d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.288 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.802c-1.89 3.072-5.91 4.042-8.98 2.152-22.51-13.836-56.823-17.843-83.448-9.761-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739zm94.56 3.072c-14.46-3.448-17.03-5.868-17.03-10.953 0-4.804 4.52-8.037 11.25-8.037 6.52 0 12.98 2.455 19.76 7.509 0.2 0.153 0.46 0.214 0.71 0.174 0.26-0.038 0.48-0.177 0.63-0.386l7.06-9.952c0.29-0.41 0.21-0.975-0.18-1.288-8.07-6.473-17.15-9.62-27.77-9.62-15.61 0-26.52 9.369-26.52 22.774 0 14.375 9.41 19.465 25.67 23.394 13.83 3.187 16.17 5.857 16.17 10.629 0 5.29-4.72 8.58-12.32 8.58-8.44 0-15.33-2.85-23.03-9.51-0.19-0.17-0.45-0.24-0.69-0.23-0.26 0.02-0.49 0.14-0.65 0.33l-7.92 9.42c-0.33 0.4-0.29 0.98 0.09 1.32 8.96 8 19.98 12.22 31.88 12.22 16.82 0 27.69-9.19 27.69-23.42 0.03-12.007-7.16-18.657-24.77-22.941l-0.03-0.013zm62.86-14.26c-7.29 0-13.27 2.872-18.21 8.757v-6.624c0-0.523-0.42-0.949-0.94-0.949h-12.95c-0.52 0-0.94 0.426-0.94 0.949v73.601c0 0.52 0.42 0.95 0.94 0.95h12.95c0.52 0 0.94-0.43 0.94-0.95v-23.23c4.94 5.53 10.92 8.24 18.21 8.24 13.55 0 27.27-10.43 27.27-30.369 0.02-19.943-13.7-30.376-27.26-30.376l-0.01 0.001zm12.21 30.375c0 10.149-6.25 17.239-15.21 17.239-8.85 0-15.53-7.41-15.53-17.239 0-9.83 6.68-17.238 15.53-17.238 8.81-0.001 15.21 7.247 15.21 17.237v0.001zm50.21-30.375c-17.45 0-31.12 13.436-31.12 30.592 0 16.972 13.58 30.262 30.91 30.262 17.51 0 31.22-13.39 31.22-30.479 0-17.031-13.62-30.373-31.01-30.373v-0.002zm0 47.714c-9.28 0-16.28-7.46-16.28-17.344 0-9.929 6.76-17.134 16.07-17.134 9.34 0 16.38 7.457 16.38 17.351 0 9.927-6.8 17.127-16.17 17.127zm68.27-46.53h-14.25v-14.566c0-0.522-0.42-0.948-0.94-0.948h-12.95c-0.52 0-0.95 0.426-0.95 0.948v14.566h-6.22c-0.52 0-0.94 0.426-0.94 0.949v11.127c0 0.522 0.42 0.949 0.94 0.949h6.22v28.795c0 11.63 5.79 17.53 17.22 17.53 4.64 0 8.49-0.96 12.12-3.02 0.3-0.16 0.48-0.48 0.48-0.82v-10.6c0-0.32-0.17-0.63-0.45-0.8-0.28-0.18-0.63-0.19-0.92-0.04-2.49 1.25-4.9 1.83-7.6 1.83-4.15 0-6.01-1.89-6.01-6.11v-26.76h14.25c0.52 0 0.94-0.426 0.94-0.949v-11.126c0.02-0.523-0.4-0.949-0.93-0.949l-0.01-0.006zm49.64 0.057v-1.789c0-5.263 2.02-7.61 6.54-7.61 2.7 0 4.87 0.536 7.3 1.346 0.3 0.094 0.61 0.047 0.85-0.132 0.25-0.179 0.39-0.466 0.39-0.77v-10.91c0-0.417-0.26-0.786-0.67-0.909-2.56-0.763-5.84-1.546-10.76-1.546-11.95 0-18.28 6.734-18.28 19.467v2.74h-6.22c-0.52 0-0.95 0.426-0.95 0.948v11.184c0 0.522 0.43 0.949 0.95 0.949h6.22v44.405c0 0.53 0.43 0.95 0.95 0.95h12.94c0.53 0 0.95-0.42 0.95-0.95v-44.402h12.09l18.52 44.402c-2.1 4.66-4.17 5.59-6.99 5.59-2.28 0-4.69-0.68-7.14-2.03-0.23-0.12-0.51-0.14-0.75-0.07-0.25 0.09-0.46 0.27-0.56 0.51l-4.39 9.63c-0.21 0.46-0.03 0.99 0.41 1.23 4.58 2.48 8.71 3.54 13.82 3.54 9.56 0 14.85-4.46 19.5-16.44l22.46-58.037c0.12-0.292 0.08-0.622-0.1-0.881-0.17-0.257-0.46-0.412-0.77-0.412h-13.48c-0.41 0-0.77 0.257-0.9 0.636l-13.81 39.434-15.12-39.46c-0.14-0.367-0.49-0.61-0.88-0.61h-22.12v-0.003zm-28.78-0.057h-12.95c-0.52 0-0.95 0.426-0.95 0.949v56.481c0 0.53 0.43 0.95 0.95 0.95h12.95c0.52 0 0.95-0.42 0.95-0.95v-56.477c0-0.523-0.42-0.949-0.95-0.949v-0.004zm-6.4-25.719c-5.13 0-9.29 4.152-9.29 9.281 0 5.132 4.16 9.289 9.29 9.289s9.28-4.157 9.28-9.289c0-5.128-4.16-9.281-9.28-9.281zm113.42 43.88c-5.12 0-9.11-4.115-9.11-9.112s4.04-9.159 9.16-9.159 9.11 4.114 9.11 9.107c0 4.997-4.04 9.164-9.16 9.164zm0.05-17.365c-4.67 0-8.2 3.71-8.2 8.253 0 4.541 3.51 8.201 8.15 8.201 4.67 0 8.2-3.707 8.2-8.253 0-4.541-3.51-8.201-8.15-8.201zm2.02 9.138l2.58 3.608h-2.18l-2.32-3.31h-1.99v3.31h-1.82v-9.564h4.26c2.23 0 3.69 1.137 3.69 3.051 0.01 1.568-0.9 2.526-2.21 2.905h-0.01zm-1.54-4.315h-2.37v3.025h2.37c1.18 0 1.89-0.579 1.89-1.514 0-0.984-0.71-1.511-1.89-1.511z"
              />
            </svg>
          </div>
          ${this.config.name?H`<div id="header_name">${this.config.name}</div>`:""}
          <div></div>
        </div>
        <div id="content">
          ${s}
        </div>
        <div id="footer">
          <div class="dropdown-wrapper">
            <div class="controls">
              <div class="dropdown">
                <div class="mediaplayer_select">
                  <svg
                    class="mediaplayer_speaker_icon"
                    width="220"
                    height="220"
                    viewBox="0 0 220 220"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M197.766 112.275q0 56.608-34.867 105.006l-8.157-6.984q32.743-44.355 32.743-98.022 0-52.565-32.632-97.9l8.158-6.984q34.755 48.398 34.755 104.884zm-24.586 0q0 46.928-28.831 88.22l-8.158-6.74q26.708-38.228 26.708-81.48 0-43.13-26.708-81.359l8.158-6.74q28.831 40.435 28.831 88.099zm-24.585 0q0 37.126-22.908 71.434l-8.27-6.617q20.897-30.632 20.897-64.817 0-33.573-20.897-64.818l8.27-6.616q22.908 34.308 22.908 71.434zm-54.646 89.2l-52.634-53.3H8.125V76.374h33.302l52.522-53.177v178.278z"
                      stroke="null"
                    />
                  </svg>
                  ${null!==(i=null!==(t=null===(e=this.getCurrentPlayer())||void 0===e?void 0:e.name)&&void 0!==t?t:this.getDefaultDevice())&&void 0!==i?i:Le("common.choose_player")}
                </div>
              </div>
            </div>
            <div class="dropdown-content">
              ${this.generateDeviceList()}
            </div>
          </div>
          <div class="footer__right">
            ${this.getPlayingState()?H`<div class="icon ${this.getShuffleState()?"playing":""}" @click=${this.onShuffleSelect}>
                  <svg width="24" height="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"
                    />
                  </svg>
                </div>`:null}
          </div>
        </div>
      </ha-card>
    `}generateDeviceList(){const[e,t]=this.getFilteredDevices();return 0==e.length&&0==t.length?H`<p>No devices found</p>`:H`
      ${e.length>0?H`<p>Spotify Connect devices</p>`:null}
      ${e.map(e=>H`<a @click=${()=>this.spotifyDeviceSelected(e)}>${e.name}</a>`)}
      ${t.length>0?H`<p>Chromecast devices</p>`:null}
      ${t.map(e=>H`<a @click=${()=>this.chromecastDeviceSelected(e)}>${e.friendly_name}</a>`)}
    `}generateButtonForCurrent(){var e;return"playing"==(null===(e=this._spotify_state)||void 0===e?void 0:e.state)?H`<div class="icon playing" @click=${this.onPauseSelect}>
        <svg width="24" height="24" viewBox="0 0 500 1000">
          <path d="M0 832h192V192H0V832zM320 192v640h192V192H320z" />
        </svg>
      </div>`:H`<div class="icon playing" @click=${this.onResumeSelect}>
        <svg width="24" height="24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>`}generateListView(){const e=[],t=this.getPlaylists();for(let i=0;i<t.length;i++){const n=t[i];e.push(H`<div class="list-item" @click=${e=>this.startUri(e,n.uri)}>
        <div class="cover" data-spotify-image-url="${n.images.length>0?n.images[0].url:""}">
          <svg viewBox="0 0 168 168">
            <path
              d="M 83.996 0.277 C 37.747 0.277 0.253 37.77 0.253 84.019 C 0.253 130.27 37.747 167.76 83.996 167.76 C 130.25 167.76 167.74 130.27 167.74 84.019 C 167.74 37.773 130.25 0.281 83.995 0.281 L 83.996 0.277 L 83.996 0.277 Z M 122.4 121.057 C 120.9 123.517 117.68 124.297 115.22 122.787 C 95.558 110.777 70.806 108.057 41.656 114.717 C 38.847 115.357 36.047 113.597 35.407 110.787 C 34.764 107.977 36.517 105.177 39.333 104.537 C 71.233 97.249 98.596 100.387 120.67 113.877 C 123.13 115.387 123.91 118.597 122.4 121.057 L 122.4 121.057 Z M 132.65 98.255 C 130.76 101.327 126.74 102.297 123.67 100.407 C 101.16 86.571 66.847 82.564 40.222 90.646 C 36.769 91.689 33.122 89.743 32.074 86.296 C 31.034 82.843 32.981 79.203 36.428 78.153 C 66.841 68.925 104.65 73.395 130.5 89.28 C 133.57 91.17 134.54 95.19 132.65 98.256 L 132.65 98.255 Z M 133.53 74.511 C 106.54 58.48 62.01 57.006 36.241 64.827 C 32.103 66.082 27.727 63.746 26.473 59.608 C 25.219 55.468 27.553 51.095 31.694 49.837 C 61.275 40.857 110.45 42.592 141.524 61.039 C 145.254 63.248 146.474 68.055 144.264 71.772 C 142.064 75.494 137.244 76.721 133.534 74.511 L 133.53 74.511 Z"
            />
          </svg>
        </div>
        ${this.isThisPlaylistPlaying(n)?this.generateButtonForCurrent():H`<div class="icon">
              <svg width="24" height="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>`}
        <p>${n.name}</p>
      </div>`)}return H`<div>${e}</div>`}generateGridIconForCurrent(){var e;return"playing"==(null===(e=this._spotify_state)||void 0===e?void 0:e.state)?H` <svg width="24" height="24" viewBox="0 0 500 1000" @click=${this.onPauseSelect}>
        <path d="M0 832h192V192H0V832zM320 192v640h192V192H320z" />
      </svg>`:H` <svg width="24" height="24" @click=${this.onResumeSelect}>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M8 5v14l11-7z" />
      </svg>`}generateGridView(){var e;const t=[],i=this.getPlaylists();for(let n=0;n<i.length;n++){const s=i[n];null===(e=this._spotify_state)||void 0===e||e.attributes.media_playlist,s.name,t.push(H`<div class="grid-item" @click=${e=>this.startUri(e,s.uri)}>
        <div
          class="grid-item-album-image ${this.isThisPlaylistPlaying(s)?"playing":""}"
          data-spotify-image-url="${s.images.length>0?s.images[0].url:""}"
        >
          <svg viewBox="0 0 168 168">
            <path
              d="M 83.996 0.277 C 37.747 0.277 0.253 37.77 0.253 84.019 C 0.253 130.27 37.747 167.76 83.996 167.76 C 130.25 167.76 167.74 130.27 167.74 84.019 C 167.74 37.773 130.25 0.281 83.995 0.281 L 83.996 0.277 L 83.996 0.277 Z M 122.4 121.057 C 120.9 123.517 117.68 124.297 115.22 122.787 C 95.558 110.777 70.806 108.057 41.656 114.717 C 38.847 115.357 36.047 113.597 35.407 110.787 C 34.764 107.977 36.517 105.177 39.333 104.537 C 71.233 97.249 98.596 100.387 120.67 113.877 C 123.13 115.387 123.91 118.597 122.4 121.057 L 122.4 121.057 Z M 132.65 98.255 C 130.76 101.327 126.74 102.297 123.67 100.407 C 101.16 86.571 66.847 82.564 40.222 90.646 C 36.769 91.689 33.122 89.743 32.074 86.296 C 31.034 82.843 32.981 79.203 36.428 78.153 C 66.841 68.925 104.65 73.395 130.5 89.28 C 133.57 91.17 134.54 95.19 132.65 98.256 L 132.65 98.255 Z M 133.53 74.511 C 106.54 58.48 62.01 57.006 36.241 64.827 C 32.103 66.082 27.727 63.746 26.473 59.608 C 25.219 55.468 27.553 51.095 31.694 49.837 C 61.275 40.857 110.45 42.592 141.524 61.039 C 145.254 63.248 146.474 68.055 144.264 71.772 C 142.064 75.494 137.244 76.721 133.534 74.511 L 133.53 74.511 Z"
            />
          </svg>
        </div>
        <div class="grid-item-overlay-icon">
          ${this.isThisPlaylistPlaying(s)?this.generateGridIconForCurrent():H`
                <svg width="24" height="24" @click=${e=>this.startUri(e,s.uri)}>
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 5v14l11-7z" />
                </svg>
              `}
        </div>
      </div>`)}const n=this.config.grid_covers_per_row?this.config.grid_covers_per_row:3;return H`<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(${90/n}%, 1fr));">
      ${t}
    </div>`}onPauseSelect(e){this.handlePlayPauseEvent(e,"media_pause")}onResumeSelect(e){this.handlePlayPauseEvent(e,"media_play")}showWarning(e){return H`<hui-warning>${e}</hui-warning>`}static get styles(){return[Qe.generalStyles,Qe.listStyles,Qe.gridStyles]}};tt.generalStyles=te`
    *:focus {
      outline: none;
    }

    ha-card {
      --header-height: 4em;
      --footer-height: 3.5em;
      padding-left: 0.5em;
      padding-right: 0.5em;
    }

    hui-warning {
      position: absolute;
      right: 0;
      left: 0;
      text-align: center;
    }

    #header {
      display: flex;
      height: var(--header-height);
    }
    #header > * {
      display: flex;
      flex-grow: 1;
      align-items: center;
    }

    #content {
      height: calc(100% - var(--header-height) - var(--footer-height));
      border: solid 2px var(--divider-color);
      border-radius: 0.2em;
      overflow: auto;
      padding: 0.2em;
      background-color: var(--primary-background-color);
    }

    #icon {
      justify-content: left;
      flex-grow: 0;
      flex-shrink: 1;
      padding-left: 0.5em;
    }

    #icon svg {
      width: 100px;
      fill: var(--primary-text-color);
    }

    #header_name {
      font-size: x-large;
      justify-content: center;
    }

    #footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--footer-height);
    }

    .footer__right {
      padding-right: 15px;
    }

    .controls {
      padding: 0.5em;
    }

    .dropdown {
      position: relative;
      display: inline-block;
    }

    .mediaplayer_select {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mediaplayer_speaker_icon {
      display: inline-block;
      padding: 3px;
      width: 17px;
      height: 17px;
      margin-right: 10px;
      border: thin solid var(--primary-text-color);
      border-radius: 50%;
    }

    .mediaplayer_speaker_icon > path {
      fill: var(--primary-text-color);
    }

    .dropdown-wrapper {
      display: contents;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      left: 1em;
      bottom: 0.5em;
      max-height: calc(100% - 1em);
      overflow-y: auto;
      background-color: var(--card-background-color);
      min-width: 250px;
      box-shadow: var(--primary-text-color) 0 0 16px 0px;
      z-index: 1;
    }

    .dropdown-content p {
      font-weight: bold;
      padding: 0.5em;
      line-height: 1.5em;
      margin: 0;
    }

    .dropdown-content a {
      color: var(--primary-text-color);
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    .dropdown-content a:hover {
      box-shadow: inset 0 0 100px 100px var(--secondary-background-color);
    }
    .controls:hover + .dropdown-content,
    .dropdown-content:hover {
      display: block;
    }

    .icon > svg {
      fill: var(--primary-text-color);
    }

    .icon.playing > svg {
      fill: var(--primary-color) !important;
    }

    @keyframes loading {
      0% {
        opacity: 100%;
      }
      50% {
        opacity: 0%;
      }
      100% {
        opacity: 100%;
      }
    }

    .loading {
      animation-name: loading;
      animation-duration: 1s;
      animation-iteration-count: 5;
      animation-timing-function: ease-in;
    }
  `,tt.listStyles=te`
    ha-card {
      --list-item-height: 3em;
      --placeholder-padding: 4px;
    }

    .list-item {
      /* height: var(--list-item-height); */
      align-items: center;
      border-bottom: solid var(--divider-color) 1px;
      display: flex;
      cursor: pointer;
    }

    .list-item:hover {
      background-color: var(--secondary-background-color);
    }

    .list-item:last-of-type {
      border-bottom: 0;
    }

    .cover {
    }

    .list-item .cover {
      height: var(--list-item-height);
      object-fit: contain;
    }

    .cover > img {
      height: 100%;
    }

    .cover > svg {
      height: calc(var(--list-item-height) - var(--placeholder-padding));
      margin: calc(var(--placeholder-padding) / 2);
    }

    .list-item > .icon {
      opacity: 100%;
      height: var(--list-item-height);
      width: var(--list-item-height);
      min-height: var(--list-item-height);
      min-width: var(--list-item-height);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .list-item > p {
      margin: 0 0.5em 0 0.5em;
    }
  `,tt.gridStyles=te`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
      grid-gap: 0.5em;
    }

    .grid-item {
      position: relative;
      cursor: pointer;
      box-shadow: var(--primary-text-color) 0 0 0.2em;
    }

    .grid-item-album-image {
      width: 100%;
      display: flex;
    }

    .grid-item-album-image > img {
      width: 100%;
    }

    .grid-item-album-image > svg {
      width: 100%;
      margin: 10px;
      fill: var(--primary-text-color);
    }

    .grid-item-album-image.playing {
      box-shadow: var(--primary-color) 0 0 0.2em 0.2em;
    }

    .grid-item-overlay-icon {
      position: absolute;
      top: calc(50% - 12px);
      left: calc(50% - 12px);
      transition: transform 0.2s;
      transform: scale(1.5);
      opacity: 0.7;
    }

    .grid-item-overlay-icon:hover {
      transform: scale(2);
      opacity: 1;
    }
    .grid-item-overlay-icon > svg {
      fill: white;
    }
  `,e([J({type:Object})],tt.prototype,"config",void 0),e([J({hasChanged:Xe})],tt.prototype,"playlists",void 0),e([J({hasChanged:Xe})],tt.prototype,"devices",void 0),e([J({hasChanged:Xe})],tt.prototype,"chromecast_devices",void 0),e([J({hasChanged:Xe})],tt.prototype,"player",void 0),e([K({hasChanged:et})],tt.prototype,"_spotify_state",void 0),tt=Qe=e([B("spotify-card")],tt);export{tt as SpotifyCard,Xe as hasChangedCustom,et as hasChangedMediaPlayer};
//# sourceMappingURL=spotify-card.js.map
