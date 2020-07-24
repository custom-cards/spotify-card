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
function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r
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
 */}const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(t,e,i=null)=>{for(;e!==i;){const i=e.nextSibling;t.removeChild(e),e=i}},s=`{{lit-${String(Math.random()).slice(2)}}}`,n=`\x3c!--${s}--\x3e`,o=new RegExp(`${s}|${n}`);class r{constructor(t,e){this.parts=[],this.element=e;const i=[],n=[],r=document.createTreeWalker(e.content,133,null,!1);let c=0,h=-1,p=0;const{strings:u,values:{length:g}}=t;for(;p<g;){const t=r.nextNode();if(null!==t){if(h++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:i}=e;let s=0;for(let t=0;t<i;t++)a(e[t].name,"$lit$")&&s++;for(;s-- >0;){const e=u[p],i=d.exec(e)[2],s=i.toLowerCase()+"$lit$",n=t.getAttribute(s);t.removeAttribute(s);const r=n.split(o);this.parts.push({type:"attribute",index:h,name:i,strings:r}),p+=r.length-1}}"TEMPLATE"===t.tagName&&(n.push(t),r.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(s)>=0){const s=t.parentNode,n=e.split(o),r=n.length-1;for(let e=0;e<r;e++){let i,o=n[e];if(""===o)i=l();else{const t=d.exec(o);null!==t&&a(t[2],"$lit$")&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),i=document.createTextNode(o)}s.insertBefore(i,t),this.parts.push({type:"node",index:++h})}""===n[r]?(s.insertBefore(l(),t),i.push(t)):t.data=n[r],p+=r}}else if(8===t.nodeType)if(t.data===s){const e=t.parentNode;null!==t.previousSibling&&h!==c||(h++,e.insertBefore(l(),t)),c=h,this.parts.push({type:"node",index:h}),null===t.nextSibling?t.data="":(i.push(t),h--),p++}else{let e=-1;for(;-1!==(e=t.data.indexOf(s,e+1));)this.parts.push({type:"node",index:-1}),p++}}else r.currentNode=n.pop()}for(const t of i)t.parentNode.removeChild(t)}}const a=(t,e)=>{const i=t.length-e.length;return i>=0&&t.slice(i)===e},c=t=>-1!==t.index,l=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function h(t,e){const{element:{content:i},parts:s}=t,n=document.createTreeWalker(i,133,null,!1);let o=u(s),r=s[o],a=-1,c=0;const l=[];let d=null;for(;n.nextNode();){a++;const t=n.currentNode;for(t.previousSibling===d&&(d=null),e.has(t)&&(l.push(t),null===d&&(d=t)),null!==d&&c++;void 0!==r&&r.index===a;)r.index=null!==d?-1:r.index-c,o=u(s,o),r=s[o]}l.forEach(t=>t.parentNode.removeChild(t))}const p=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,133,null,!1);for(;i.nextNode();)e++;return e},u=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(c(e))return i}return-1};
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
const g=new WeakMap,_=t=>"function"==typeof t&&g.has(t),f={},m={};
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
class v{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this.__parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),i=[],s=this.template.parts,n=document.createTreeWalker(t,133,null,!1);let o,r=0,a=0,l=n.nextNode();for(;r<s.length;)if(o=s[r],c(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(i.push(l),n.currentNode=l.content),null===(l=n.nextNode())&&(n.currentNode=i.pop(),l=n.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const y=` ${s} `;class w{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){const t=this.strings.length-1;let e="",i=!1;for(let o=0;o<t;o++){const t=this.strings[o],r=t.lastIndexOf("\x3c!--");i=(r>-1||i)&&-1===t.indexOf("--\x3e",r+1);const a=d.exec(t);e+=null===a?t+(i?y:n):t.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+s}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}
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
 */const b=t=>null===t||!("object"==typeof t||"function"==typeof t),S=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class x{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new $(this)}_getValue(){const t=this.strings,e=t.length-1;let i="";for(let s=0;s<e;s++){i+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(b(t)||!S(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class ${constructor(t){this.value=void 0,this.committer=t}setValue(t){t===f||b(t)&&t===this.value||(this.value=t,_(t)||(this.committer.dirty=!0))}commit(){for(;_(this.value);){const t=this.value;this.value=f,t(this)}this.value!==f&&this.committer.commit()}}class C{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(l()),this.endNode=t.appendChild(l())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=l()),t.__insert(this.endNode=l())}insertAfterPart(t){t.__insert(this.startNode=l()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;_(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=f,t(this)}const t=this.__pendingValue;t!==f&&(b(t)?t!==this.value&&this.__commitText(t):t instanceof w?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):S(t)?this.__commitIterable(t):t===m?(this.value=m,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,i="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof v&&this.value.template===e)this.value.update(t.values);else{const i=new v(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,s=0;for(const n of t)i=e[s],void 0===i&&(i=new C(this.options),e.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(e[s-1])),i.setValue(n),i.commit(),s++;s<e.length&&(e.length=s,this.clear(i&&i.endNode))}clear(t=this.startNode){i(this.startNode.parentNode,t.nextSibling,this.endNode)}}class P{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;_(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=f,t(this)}if(this.__pendingValue===f)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=f}}class k extends x{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new M(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class M extends ${}let N=!1;(()=>{try{const t={get capture(){return N=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class T{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;_(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=f,t(this)}if(this.__pendingValue===f)return;const t=this.__pendingValue,e=this.value,i=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=null!=t&&(null==e||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=V(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=f}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const V=t=>t&&(N?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
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
 */;function E(t){let e=O.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},O.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const n=t.strings.join(s);return i=e.keyString.get(n),void 0===i&&(i=new r(t,t.getTemplateElement()),e.keyString.set(n,i)),e.stringsArray.set(t.strings,i),i}const O=new Map,D=new WeakMap;
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
 */const A=new
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
class{handleAttributeExpressions(t,e,i,s){const n=e[0];if("."===n){return new k(t,e.slice(1),i).parts}if("@"===n)return[new T(t,e.slice(1),s.eventContext)];if("?"===n)return[new P(t,e.slice(1),i)];return new x(t,e,i).parts}handleTextExpression(t){return new C(t)}};
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
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const z=(t,...e)=>new w(t,e,"html",A)
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
 */,U=(t,e)=>`${t}--${e}`;let j=!0;void 0===window.ShadyCSS?j=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),j=!1);const H=t=>e=>{const i=U(e.type,t);let n=O.get(i);void 0===n&&(n={stringsArray:new WeakMap,keyString:new Map},O.set(i,n));let o=n.stringsArray.get(e.strings);if(void 0!==o)return o;const a=e.strings.join(s);if(o=n.keyString.get(a),void 0===o){const i=e.getTemplateElement();j&&window.ShadyCSS.prepareTemplateDom(i,t),o=new r(e,i),n.keyString.set(a,o)}return n.stringsArray.set(e.strings,o),o},Y=["html","svg"],R=new Set,q=(t,e,i)=>{R.add(t);const s=i?i.element:document.createElement("template"),n=e.querySelectorAll("style"),{length:o}=n;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(s,t);const r=document.createElement("style");for(let t=0;t<o;t++){const e=n[t];e.parentNode.removeChild(e),r.textContent+=e.textContent}(t=>{Y.forEach(e=>{const i=O.get(U(e,t));void 0!==i&&i.keyString.forEach(t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{i.add(t)}),h(t,i)})})})(t);const a=s.content;i?function(t,e,i=null){const{element:{content:s},parts:n}=t;if(null==i)return void s.appendChild(e);const o=document.createTreeWalker(s,133,null,!1);let r=u(n),a=0,c=-1;for(;o.nextNode();){c++;for(o.currentNode===i&&(a=p(e),i.parentNode.insertBefore(e,i));-1!==r&&n[r].index===c;){if(a>0){for(;-1!==r;)n[r].index+=a,r=u(n,r);return}r=u(n,r)}}}(i,r,a.firstChild):a.insertBefore(r,a.firstChild),window.ShadyCSS.prepareTemplateStyles(s,t);const c=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==c)e.insertBefore(c.cloneNode(!0),e.firstChild);else if(i){a.insertBefore(r,a.firstChild);const t=new Set;t.add(r),h(i,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const L={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},F=(t,e)=>e!==t&&(e==e||t==t),W={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:F};class I extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,i)=>{const s=this._attributeNameForProperty(i,e);void 0!==s&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=W){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(i){const s=this[t];this[e]=i,this._requestUpdate(t,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||W}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty("finalized")||t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=F){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,s=e.converter||L,n="function"==typeof s?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,s=e.converter;return(s&&s.toAttribute||L.toAttribute)(t,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=W){const s=this.constructor,n=s._attributeNameForProperty(t,i);if(void 0!==n){const t=s._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(n):this.setAttribute(n,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const i=this.constructor,s=i._attributeToPropertyMap.get(t);if(void 0!==s){const t=i.getPropertyOptions(s);this._updateState=16|this._updateState,this[s]=i._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}_requestUpdate(t,e){let i=!0;if(void 0!==t){const s=this.constructor,n=s.getPropertyOptions(t);s._valueHasChanged(this[t],e,n.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==n.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,n))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this._requestUpdate(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(e){throw t=!1,this._markUpdated(),e}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}I.finalized=!0;
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
const B=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){window.customElements.define(t,e)}}})(t,e),G=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?Object.assign(Object.assign({},e),{finisher(i){i.createProperty(e.key,t)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function J(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):G(t,e)}function Z(t){return J({attribute:!1,hasChanged:null==t?void 0:t.hasChanged})}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const K="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol();class X{constructor(t,e){if(e!==Q)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(K?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const tt=(t,...e)=>{const i=e.reduce((e,i,s)=>e+(t=>{if(t instanceof X)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[s+1],t[0]);return new X(i,Q)};
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const et={};class it extends I{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(void 0===t)this._styles=[];else if(Array.isArray(t)){const e=(t,i)=>t.reduceRight((t,i)=>Array.isArray(i)?e(i,t):(t.add(i),t),i),i=e(t,new Set),s=[];i.forEach(t=>s.unshift(t)),this._styles=s}else this._styles=[t]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?K?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==et&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){return et}}it.finalized=!0,it.render=(t,e,s)=>{if(!s||"object"!=typeof s||!s.scopeName)throw new Error("The `scopeName` option is required.");const n=s.scopeName,o=D.has(e),r=j&&11===e.nodeType&&!!e.host,a=r&&!R.has(n),c=a?document.createDocumentFragment():e;if(((t,e,s)=>{let n=D.get(e);void 0===n&&(i(e,e.firstChild),D.set(e,n=new C(Object.assign({templateFactory:E},s))),n.appendInto(e)),n.setValue(t),n.commit()})(t,c,Object.assign({templateFactory:H(n)},s)),a){const t=D.get(c);D.delete(c);const s=t.value instanceof v?t.value.template:void 0;q(n,c,s),i(e,e.firstChild),e.appendChild(c),D.set(e,t)}!o&&r&&window.ShadyCSS.styleElement(e.host)};var st=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,nt="[^\\s]+",ot=/\[([^]*?)\]/gm;function rt(t,e){for(var i=[],s=0,n=t.length;s<n;s++)i.push(t[s].substr(0,e));return i}var at=function(t){return function(e,i){var s=i[t].map((function(t){return t.toLowerCase()})).indexOf(e.toLowerCase());return s>-1?s:null}};function ct(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var s=0,n=e;s<n.length;s++){var o=n[s];for(var r in o)t[r]=o[r]}return t}var lt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dt=["January","February","March","April","May","June","July","August","September","October","November","December"],ht=rt(dt,3),pt={dayNamesShort:rt(lt,3),dayNames:lt,monthNamesShort:ht,monthNames:dt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},ut=ct({},pt),gt=function(t,e){for(void 0===e&&(e=2),t=String(t);t.length<e;)t="0"+t;return t},_t={D:function(t){return String(t.getDate())},DD:function(t){return gt(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return String(t.getDay())},dd:function(t){return gt(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return String(t.getMonth()+1)},MM:function(t){return gt(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return gt(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return gt(t.getFullYear(),4)},h:function(t){return String(t.getHours()%12||12)},hh:function(t){return gt(t.getHours()%12||12)},H:function(t){return String(t.getHours())},HH:function(t){return gt(t.getHours())},m:function(t){return String(t.getMinutes())},mm:function(t){return gt(t.getMinutes())},s:function(t){return String(t.getSeconds())},ss:function(t){return gt(t.getSeconds())},S:function(t){return String(Math.round(t.getMilliseconds()/100))},SS:function(t){return gt(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return gt(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+gt(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)},Z:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+gt(Math.floor(Math.abs(e)/60),2)+":"+gt(Math.abs(e)%60,2)}},ft=function(t){return+t-1},mt=[null,"[1-9]\\d?"],vt=[null,nt],yt=["isPm",nt,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],wt=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}],bt=(at("monthNamesShort"),at("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var St=function(t,e,i){if(void 0===e&&(e=bt.default),void 0===i&&(i={}),"number"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw new Error("Invalid Date pass to format");var s=[];e=(e=bt[e]||e).replace(ot,(function(t,e){return s.push(e),"@@@"}));var n=ct(ct({},ut),i);return(e=e.replace(st,(function(e){return _t[e](t,n)}))).replace(/@@@/g,(function(){return s.shift()}))},xt=(function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}(),function(t,e,i,s){s=s||{},i=null==i?{}:i;var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n});const $t=t=>{let e=[];function i(i,s){t=s?i:Object.assign(Object.assign({},t),i);let n=e;for(let e=0;e<n.length;e++)n[e](t)}return{get state(){return t},action(e){function s(t){i(t,!1)}return function(){let i=[t];for(let t=0;t<arguments.length;t++)i.push(arguments[t]);let n=e.apply(this,i);if(null!=n)return n instanceof Promise?n.then(s):s(n)}},setState:i,subscribe:t=>(e.push(t),()=>{!function(t){let i=[];for(let s=0;s<e.length;s++)e[s]===t?t=null:i.push(e[s]);e=i}(t)})}},Ct=(t,e,i,s)=>{if(t[e])return t[e];let n,o=0,r=$t();const a=()=>i(t).then(t=>r.setState(t,!0)),c=()=>a().catch(e=>{if(t.connected)throw e});return t[e]={get state(){return r.state},refresh:a,subscribe(e){o++,1===o&&(s&&(n=s(t,r)),t.addEventListener("ready",c),c());const i=r.subscribe(e);return void 0!==r.state&&setTimeout(()=>e(r.state),0),()=>{i(),o--,o||(n&&n.then(t=>{t()}),t.removeEventListener("ready",a))}}},t[e]},Pt=t=>t.sendMessagePromise({type:"get_states"});function kt(t,e){if(void 0===t)return null;const{domain:i,service:s}=e.data;return{[i]:Object.assign({},t[i],{[s]:{description:"",fields:{}}})}}function Mt(t,e){if(void 0===t)return null;const{domain:i,service:s}=e.data,n=t[i];if(!n||!(s in n))return null;const o={};return Object.keys(n).forEach(t=>{t!==s&&(o[t]=n[t])}),{[i]:o}}const Nt=t=>t.sendMessagePromise({type:"get_services"}),Tt=(t,e)=>Promise.all([t.subscribeEvents(e.action(kt),"service_registered"),t.subscribeEvents(e.action(Mt),"service_removed")]).then(t=>()=>t.forEach(t=>t()));async function Vt(t){const e=await Pt(t),i={};for(let t=0;t<e.length;t++){const s=e[t];i[s.entity_id]=s}return i}const Et=(t,e)=>t.subscribeEvents(t=>function(t,e){const i=t.state;if(void 0===i)return;const{entity_id:s,new_state:n}=e.data;if(n)t.setState({[n.entity_id]:n});else{const e=Object.assign({},i);delete e[s],t.setState(e,!0)}}(e,t),"state_changed"),Ot=(t,e)=>(t=>Ct(t,"_ent",Vt,Et))(t).subscribe(e);var Dt={version:"Version",description:"A custom card for displaying Spotify-Playlist and starting playback",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_missing_spotcast:"Spotcast integration has to be installed for this component to work",show_missing_spotify:"Spotify integration has to be installed for playback information",choose_player:"Choose player"},At={general:"General",general_description:"General settings for this card",appearance:"Appearance",appearance_description:"Customize the style, icon, etc",advanced:"Advanced",advanced_description:"Customize advanced settings",hide_warning:"Hide warnings",playlist_type:"Playlist Type",limit:"Amount of playlists shown",height:"Height of card",country_code:"Country Code for featured playlists",always_play_random_song:"Always play random song when starting playback",title:"Title of card",display_style:"Display Style",grid_covers_per_row:"Number of covers per row",account:"Account",filter_out_cast_devices:"Filter out chromecast devices",spotify_entity:"Spotify media player entity",default_device:"Default device name"},zt={common:Dt,settings:At},Ut={version:"Version",description:"Eine Karte um Spotify-Playlist anzuzeigen und abzuspielen",invalid_configuration:"Ungültige Konfiguration",show_warning:"Warnung",show_missing_spotcast:"Die Spotcast-Integration muss installiert sein, damit diese Karte funktioniert",show_missing_spotify:"Die Spotify-Integration muss installiert sein, damit der Spotify-Status angezeigt werden kann"},jt={general:"Generell",general_description:"Generelle Einstellungen",appearance:"Aussehen",appearance_description:"Passe den Stil und anderes an",hide_warning:"Verstecke Warnhinweise",playlist_type:"Playlist Typ",limit:"Anzahl an angezeigten Playlisten",height:"Höhe der Karte",country_code:"Länder-Code für die Featured-Playlist",always_play_random_song:"Spiele immer einen zufälligen Song beim Starten der Wiedergabe ab",title:"Titel der Karte",display_style:"Anzeige-Stil",grid_covers_per_row:"Number of covers per row",account:"Account",filter_out_cast_devices:"Filter out chromecast devices",spotify_entity:"Spotify media player entity",default_device:"Default device name"},Ht={common:Ut,settings:jt},Yt={version:"Version",description:"A custom card for displaying Spotify-Playlist and starting playback",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_missing_spotcast:"Spotcast integration has to be installed for this component to work",show_missing_spotify:"Spotify integration has to be installed for playback information"},Rt={general:"General",general_description:"General settings for this card",appearance:"Appearance",appearance_description:"Customize the style, icon, etc",hide_warning:"Hide warnings",playlist_type:"Playlist Type",limit:"Amount of playlists shown",height:"Height of card",country_code:"Country Code for featured playlists",always_play_random_song:"Always play random song when starting playback",title:"Title of card",display_style:"Display Style",grid_covers_per_row:"Number of covers per row",account:"Account",filter_out_cast_devices:"Filter out chromecast devices",spotify_entity:"Spotify media player entity",default_device:"Default device name"},qt={common:Yt,settings:Rt};const Lt={en:Object.freeze({__proto__:null,common:Dt,settings:At,default:zt}),de:Object.freeze({__proto__:null,common:Ut,settings:jt,default:Ht}),se:Object.freeze({__proto__:null,common:Yt,settings:Rt,default:qt})};function Ft(t,e="",i=""){const s=t.split(".")[0],n=t.split(".")[1],o=(localStorage.getItem("selectedLanguage")||navigator.language.split("-")[0]||"en").replace(/['"]+/g,"").replace("-","_");let r;try{r=Lt[o][s][n]}catch(t){r=Lt.en[s][n]}return void 0===r&&(r=Lt.en[s][n]),""!==e&&""!==i&&(r=r.replace(e,i)),r}const Wt={general:{icon:"tune",name:Ft("settings.general"),secondary:Ft("settings.general_description"),show:!0},appearance:{icon:"palette",name:Ft("settings.appearance"),secondary:Ft("settings.appearance_description"),show:!1},advanced:{icon:"pencil",name:Ft("settings.advanced"),secondary:Ft("settings.advanced_description"),show:!1}},It=["Default","featured","discover-weekly"],Bt=["List","Grid"];let Gt=class extends it{constructor(){super(...arguments),this.accounts=[],this.hidden_cast_devices=[],this.chromecast_devices=[]}async connectedCallback(){super.connectedCallback();const t=await this.hass.callWS({type:"spotcast/accounts"});this.accounts=t;const e=await this.hass.callWS({type:"spotcast/castdevices"});this.chromecast_devices=e.map(t=>t.friendly_name),this.requestUpdate()}setConfig(t){this._config=t}get _name(){return this._config&&this._config.name||""}get _account(){return this._config?this._config.account||"default":""}get _spotify_entity(){if(this._config){const t=this.getMediaPlayerEntities().filter(t=>t.entity_id.includes("spotify"));return this._config.spotify_entity||(t.length>0?t[0].entity_id:"")}return""}get _country_code(){return this._config&&this._config.country_code||""}get _limit(){return this._config&&this._config.limit||10}get _playlist_type(){return this._config?this._config.playlist_type||"Default":""}get _always_play_random_song(){return this._config&&this._config.always_play_random_song||!1}get _height(){return this._config&&this._config.height||""}get _display_style(){return this._config&&this._config.display_style||"List"}get _grid_covers_per_row(){return this._config&&this._config.grid_covers_per_row||5}get _grid_center_covers(){return this._config&&this._config.grid_center_covers||!1}get _hidden_cast_devices(){return this._config&&this._config.hidden_cast_devices||[]}get _hide_warning(){return this._config&&this._config.hide_warning||!1}get _show_warning(){return this._config&&this._config.show_warning||!1}get _show_error(){return this._config&&this._config.show_error||!1}get _default_device(){return this._config&&this._config.default_device||""}getMediaPlayerEntities(){return Object.keys(this.hass.states).map(t=>this.hass.states[t]).filter(t=>t.entity_id.match("media_player[.]"))}renderGeneral(){const t=this.getMediaPlayerEntities().map(t=>t.entity_id);return z`
      <div class="values">
        <div>
          <paper-dropdown-menu
            label=${Ft("settings.account")}
            @value-changed=${this._valueChanged}
            .configValue=${"account"}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${this.accounts.indexOf(this._account)}>
              ${this.accounts.map(t=>z` <paper-item>${t}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu
            label=${Ft("settings.spotify_entity")}
            @value-changed=${this._valueChanged}
            .configValue=${"spotify_entity"}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${t.indexOf(this._spotify_entity)}>
              ${t.map(t=>z` <paper-item>${t}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu
            label=${Ft("settings.playlist_type")}
            @value-changed=${this._valueChanged}
            .configValue=${"playlist_type"}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${It.indexOf(this._playlist_type)}>
              ${It.map(t=>z` <paper-item>${t}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${Ft("settings.limit")}</div>
          <paper-slider
            .value=${this._limit}
            .configValue=${"limit"}
            @value-changed=${this._valueChanged}
            max="50"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <paper-input
            label=${Ft("settings.height")}
            .value=${this._height}
            .configValue=${"height"}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-input
            label=${Ft("settings.country_code")}
            .value=${this._country_code}
            .configValue=${"country_code"}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div>
          <div>${Ft("settings.always_play_random_song")}</div>
          <ha-switch
            aria-label=${"Toggle always_play_random_song "+(this._hide_warning?"off":"on")}
            .checked=${this._always_play_random_song}
            .configValue=${"always_play_random_song"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        <div>
          <paper-input
            label=${Ft("settings.default_device")}
            .value=${this._default_device}
            .configValue=${"default_device"}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
      </div>
    `}renderAppearance(){return z`
      <div class="values">
        <div>
          <ha-switch
            aria-label=${"Toogle Warnings "+(this._hide_warning?"off":"on")}
            .checked=${this._hide_warning}
            .configValue=${"hide_warning"}
            @change=${this._valueChanged}
            >${Ft("settings.hide_warning")}</ha-switch
          >
        </div>
        <div>
          <paper-input
            label=${Ft("settings.title")}
            .value=${this._name}
            .configValue=${"name"}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-dropdown-menu
            label=${Ft("settings.display_style")}
            @value-changed=${this._valueChanged}
            .configValue=${"display_style"}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${Bt.indexOf(this._display_style)}>
              ${Bt.map(t=>z` <paper-item>${t}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${Ft("settings.grid_covers_per_row")}</div>
          <paper-slider
            .value=${this._grid_covers_per_row}
            .configValue=${"grid_covers_per_row"}
            @value-changed=${this._valueChanged}
            max="10"
            min="1"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <div>${Ft("settings.grid_center_covers")}</div>
          <ha-switch
            aria-label=${"Toggle grid_center_covers "+(this._hide_warning?"off":"on")}
            .checked=${this._grid_center_covers}
            .configValue=${"grid_center_covers"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        <span>Show Warning?</span>
        <ha-switch
          aria-label=${"Toggle warning "+(this._show_error?"off":"on")}
          .checked=${this._show_warning}
          .configValue=${"show_warning"}
          @change=${this._valueChanged}
        ></ha-switch>
        <span>Show Error?</span>
        <ha-switch
          aria-label=${"Toggle error "+(this._show_error?"off":"on")}
          .checked=${this._show_error}
          .configValue=${"show_error"}
          @change=${this._valueChanged}
        ></ha-switch>
      </div>
    `}renderAdvanced(){return z`
      <div class="values">
        <div class="filter_grid">
          <div class="filter_grid--title">${Ft("settings.filter_out_cast_devices")}</div>
          ${this.chromecast_devices.map((t,e)=>z`
              <paper-checkbox
                .idx=${e}
                .checked=${this._hidden_cast_devices.includes(t)}
                @checked-changed=${this._valueChangedForList}
                .configValue=${"hidden_cast_devices"}
              >
                ${t}
              </paper-checkbox>
            `)}
        </div>
      </div>
    `}render(){return this.hass?z`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${"general"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Wt.general.icon}></ha-icon>
            <div class="title">${Wt.general.name}</div>
          </div>
          <div class="secondary">${Wt.general.secondary}</div>
        </div>
        ${Wt.general.show?this.renderGeneral():""}
        <div class="option" @click=${this._toggleOption} .option=${"appearance"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Wt.appearance.icon}></ha-icon>
            <div class="title">${Wt.appearance.name}</div>
          </div>
          <div class="secondary">${Wt.appearance.secondary}</div>
        </div>
        ${Wt.appearance.show?this.renderAppearance():""}
        <div class="option" @click=${this._toggleOption} .option=${"advanced"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Wt.advanced.icon}></ha-icon>
            <div class="title">${Wt.advanced.name}</div>
          </div>
          <div class="secondary">${Wt.advanced.secondary}</div>
        </div>
        ${Wt.advanced.show?this.renderAdvanced():""}
      </div>
    `:z``}_toggleOption(t){this._toggleThing(t,Wt)}_toggleThing(t,e){const i=!e[t.target.option].show;for(const[t]of Object.entries(e))e[t].show=!1;e[t.target.option].show=i,this._toggle=!this._toggle}_valueChanged(t){if(!this._config||!this.hass||null===t.target.offsetParent)return;const{target:e}=t;if(this["_"+e.configValue]!==e.value){if(e.configValue)if(!1===e.checked||""===e.value){const t=Object.assign({},this._config);delete t[e.configValue],this._config=t}else"height"==e.configValue&&(e.value=Number(e.value)),this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:void 0!==e.checked?e.checked:e.value});xt(this,"config-changed",{config:this._config}),this.requestUpdate(e.configValue)}}_valueChangedForList(t){if(!this._config||!this.hass)return;const{checked:e}=t.currentTarget,i=t.target.configValue,s=t.target.innerText,n=JSON.parse(JSON.stringify(this._config));n[i]||(n[i]=[]),e?n[i].includes(s)||n[i].push(s):n[i]=n[i].filter(t=>t!==s),xt(this,"config-changed",{config:n}),this.requestUpdate(i)}static get styles(){return tt`
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
    `}};t([J({type:Object})],Gt.prototype,"hass",void 0),t([Z()],Gt.prototype,"_config",void 0),t([Z()],Gt.prototype,"_toggle",void 0),Gt=t([B("spotify-card-editor")],Gt);class Jt{constructor(t){this.playlists=[],this.devices=[],this.chromecast_devices=[],this.state_ttl=4e3,this.last_state_update_time=0,this.loading=!1,this.parent=t}is_loading(){return setTimeout(this.set_loading_off,100),this.loading}set_loading_off(){this.loading=!1}is_loaded(){return void 0!==this.playlists.length}getPlaybackOptions(t){return{uri:t,force_playback:"playing"==this.parent.getSpotifyEntityState(),random_song:this.parent.config.always_play_random_song||!1,account:this.parent.config.account}}playUri(t){const e=this.getCurrentPlayer();if(e)this.playUriOnConnectDevice(e.id,t);else{const e=this.parent.config.default_device;if(e){const i=this.devices.filter(t=>t.name==e);if(i.length>0)return this.playUriOnConnectDevice(i[0].id,t);{const i=this.chromecast_devices.filter(t=>t.friendly_name==e);if(i.length>0)return this.playUriOnCastDevice(i[0].friendly_name,t);console.error("Could not find default_device:"+e)}}console.error("No active device nor default device in settings")}}transferPlaybackToCastDevice(t){this.parent.hass.callService("spotcast","start",{device_name:t,force_playback:!0,account:this.parent.config.account})}transferPlaybackToConnectDevice(t){this.parent.hass.callService("spotcast","start",{spotify_device_id:t,force_playback:!0,account:this.parent.config.account})}playUriOnCastDevice(t,e){const i=Object.assign(Object.assign({},this.getPlaybackOptions(e)),{device_name:t});this.parent.hass.callService("spotcast","start",i)}playUriOnConnectDevice(t,e){const i=Object.assign(Object.assign({},this.getPlaybackOptions(e)),{spotify_device_id:t});this.parent.hass.callService("spotcast","start",i)}async updateState(){if(!((new Date).getTime()-this.last_state_update_time<this.state_ttl))try{await this.fetchDevices(),await this.fetchPlayer(),await this.fetchChromecasts(),this.last_state_update_time=(new Date).getTime()}catch(t){console.error("updateState error:",t)}}getCurrentPlayer(){var t;return null===(t=this.player)||void 0===t?void 0:t.device}async fetchPlayer(){const t={type:"spotcast/player",account:this.parent.config.account};try{this.player=await this.parent.hass.callWS(t)}catch(t){console.error("Failed to fetch player",t)}}async fetchDevices(){const t={type:"spotcast/devices",account:this.parent.config.account};try{const e=await this.parent.hass.callWS(t);this.devices=e.devices}catch(t){console.error("Failed to fetch devices",t)}}async fetchChromecasts(){try{this.chromecast_devices=await this.parent.hass.callWS({type:"spotcast/castdevices"})}catch(t){console.error("Failed to fetch cast devices",t),this.chromecast_devices=[]}}async fetchPlaylists(){this.loading=!0;const t={type:"spotcast/playlists",playlist_type:this.parent.config.playlist_type||"",account:this.parent.config.account,limit:this.parent.config.limit};this.parent.config.country_code&&(t.country_code=this.parent.config.country_code);try{const e=await this.parent.hass.callWS(t);this.playlists=e.items}catch(t){console.error("Failed to fetch playlists",t)}}}var Zt;console.info(`%c  SPOTIFY-CARD \n%c  ${Ft("common.version")} 2.0.0    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"spotify-card",name:"Spotify Card",description:Ft("common.description"),preview:!0});let Kt=Zt=class extends it{constructor(){super(...arguments),this.spotcast_installed=!1,this.spotify_installed=!1,this.fetch_time_out=0}static async getConfigElement(){return document.createElement("spotify-card-editor")}static getStubConfig(){return{}}doSubscribeEntities(){var t;(null===(t=this.hass)||void 0===t?void 0:t.connection)&&!this.unsubscribe_entitites&&this.isConnected&&(this.unsubscribe_entitites=Ot(this.hass.connection,t=>this.entitiesUpdated(t)))}connectedCallback(){super.connectedCallback(),this.spotcast_connector=new Jt(this),this.doSubscribeEntities()}updated(t){super.updated(t),this.doSubscribeEntities()}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe_entitites&&this.unsubscribe_entitites()}entitiesUpdated(t){let e=!1;for(const i in t)i.startsWith("media_player")&&((i.startsWith("media_player.spotify_")||i==this.config.spotify_entity)&&(this.spotify_installed=!0,this.spotify_state=t[i]),e=!0);e&&!document.hidden&&(this.fetch_time_out&&clearTimeout(this.fetch_time_out),this.fetch_time_out=setTimeout(()=>{this.spotcast_connector.updateState().then(()=>{this.requestUpdate()})},500))}getSpotifyEntityState(){return this.spotify_state?this.spotify_state.state:""}setConfig(t){let e="";if(t.limit&&"number"!=typeof t.limit&&(e="limit"),t.playlist_type&&!It.includes(t.playlist_type)&&(e="playlist_type"),t.country_code&&"string"!=typeof t.country_code&&(e="country_code"),t.height&&"number"!=typeof t.height&&(e="height"),t.display_style&&!Bt.includes(t.display_style)&&(e="display_style"),t.darkmode&&"boolean"!=typeof t.darkmode&&(e="darkmode"),t.show_error||""!=e)throw new Error(Ft("common.invalid_configuration")+": "+e);t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this.config=Object.assign({},t)}spotifyDeviceSelected(t){if(this.spotcast_connector.getCurrentPlayer())return this.spotcast_connector.transferPlaybackToConnectDevice(t.id);const e=this.spotcast_connector.playlists[0];console.log("spotifyDeviceSelected playing first playlist"),this.spotcast_connector.playUriOnConnectDevice(t.id,e.uri)}chromecastDeviceSelected(t){if(this.spotcast_connector.getCurrentPlayer())return this.spotcast_connector.transferPlaybackToCastDevice(t.friendly_name);const e=this.spotcast_connector.playlists[0];console.log("chromecastDeviceSelected playing first playlist"),this.spotcast_connector.playUriOnCastDevice(t.friendly_name,e.uri)}onShuffleSelect(){var t,e;"playing"==(null===(t=this.spotify_state)||void 0===t?void 0:t.state)&&this.hass.callService("media_player","shuffle_set",{entity_id:this.spotify_state.entity_id,shuffle:!(null===(e=this.spotcast_connector.player)||void 0===e?void 0:e.shuffle_state)})}handlePlayPauseEvent(t,e){t.stopPropagation(),this.spotify_state&&this.hass.callService("media_player",e,{entity_id:this.spotify_state.entity_id})}onPauseSelect(t){this.handlePlayPauseEvent(t,"media_pause")}onResumeSelect(t){this.handlePlayPauseEvent(t,"media_play")}render(){var t,e,i,s;let n=z``;var o;this.spotcast_installed||this.hass.connection&&void 0!==(o=this.hass.connection,Ct(o,"_srv",Nt,Tt)).state.spotcast&&(this.spotcast_installed=!0),this.config.show_warning&&(n=this.showWarning(Ft("common.show_warning"))),this.spotcast_installed||(n=this.showWarning(Ft("common.show_missing_spotcast"))),this.spotify_installed||(n=this.showWarning(Ft("common.show_missing_spotify")));let r=z`<div>Loading...</div>`;!this.spotcast_connector.is_loading()&&this.spotcast_installed?this.spotcast_connector.fetchPlaylists().then(()=>{this.requestUpdate()}):r="grid"==(null===(t=this.config.display_style)||void 0===t?void 0:t.toLowerCase())?this.generateGridView():this.generateListView();const a=this.spotcast_connector.getCurrentPlayer(),c=null!==(e=null==a?void 0:a.name)&&void 0!==e?e:Ft("common.choose_player");return z`
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
          ${this.config.name?z`<div id="header_name">${this.config.name}</div>`:""}
          <div></div>
        </div>
        <div id="content">
          ${r}
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
                  ${c}
                </div>
              </div>
            </div>
            ${this.generateDeviceList()}
          </div>
          <div class="footer__right">
            ${"playing"==(null===(i=this.spotify_state)||void 0===i?void 0:i.state)?z`<div
                  class="icon ${(null===(s=this.spotcast_connector.player)||void 0===s?void 0:s.shuffle_state)?"playing":""}"
                  @click=${this.onShuffleSelect}
                >
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
    `}generateDeviceList(){var t;const e=null!==(t=this.config.hidden_cast_devices)&&void 0!==t?t:[];return z`
      <div class="dropdown-content">
        <p>Spotify Connect devices</p>
        ${this.spotcast_connector.devices.map(t=>z` <a @click=${()=>this.spotifyDeviceSelected(t)}>${t.name}</a> `)}
        ${this.spotcast_connector.chromecast_devices.length?z`<p>Chromecast devices</p>`:null}
        ${this.spotcast_connector.chromecast_devices.map(t=>e.includes(t.friendly_name)?null:z`<a @click=${()=>this.chromecastDeviceSelected(t)}>${t.friendly_name}</a>`)}
      </div>
    `}generateButtonForCurrent(){var t;return"playing"==(null===(t=this.spotify_state)||void 0===t?void 0:t.state)?z`<div class="icon playing" @click=${this.onPauseSelect}>
        <svg width="24" height="24" viewBox="0 0 500 1000">
          <path d="M0 832h192V192H0V832zM320 192v640h192V192H320z" />
        </svg>
      </div>`:z`<div class="icon playing" @click=${this.onResumeSelect}>
        <svg width="24" height="24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>`}generateListView(){var t;if(this.spotcast_connector.is_loaded()){const e=[];for(let i=0;i<this.spotcast_connector.playlists.length;i++){const s=this.spotcast_connector.playlists[i],n=(null===(t=this.spotify_state)||void 0===t?void 0:t.attributes.media_playlist)===s.name;e.push(z`<div class="list-item" @click=${()=>this.spotcast_connector.playUri(s.uri)}>
          <img src="${s.images[s.images.length-1].url}" />

          ${n?this.generateButtonForCurrent():z`<div class="icon">
                <svg width="24" height="24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>`}

          <p>${s.name}</p>
        </div>`)}return z`<div>${e}</div>`}return z``}generateGridIconForCurrent(){var t;return"playing"==(null===(t=this.spotify_state)||void 0===t?void 0:t.state)?z` <svg width="24" height="24" viewBox="0 0 500 1000" @click=${this.onPauseSelect}>
        <path d="M0 832h192V192H0V832zM320 192v640h192V192H320z" />
      </svg>`:z` <svg width="24" height="24" @click=${this.onResumeSelect}>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M8 5v14l11-7z" />
      </svg>`}generateGridView(){var t,e;if(!this.spotcast_connector.is_loaded())return z``;const i=[];for(let s=0;s<this.spotcast_connector.playlists.length;s++){const n=this.spotcast_connector.playlists[s],o=(null===(t=this.spotify_state)||void 0===t?void 0:t.attributes.media_playlist)===n.name;null===(e=this.spotify_state)||void 0===e||e.attributes.media_playlist,n.name,i.push(z`<div class="grid-item" @click=${()=>this.spotcast_connector.playUri(n.uri)}>
        <img
          class="grid-item-album-image ${o?"playing":""}"
          src="${n.images[n.images.length-1].url}"
        />
        <div class="grid-item-overlay-icon">
          ${o?this.generateGridIconForCurrent():z`
                <svg width="24" height="24" @click=${()=>this.spotcast_connector.playUri(n.uri)}>
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 5v14l11-7z" />
                </svg>
              `}
        </div>
      </div>`)}const s=this.config.grid_covers_per_row?this.config.grid_covers_per_row:3;return z`<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(${90/s}%, 1fr));">
      ${i}
    </div>`}showWarning(t){return z`<hui-warning>${t}</hui-warning>`}static get styles(){return[Zt.generalStyles,Zt.listStyles,Zt.gridStyles]}};Kt.generalStyles=tt`
    *:focus {
      outline: none;
    }

    ha-card {
      --header-height: 4em;
      --footer-height: 3.5em;
      padding-left: 0.5em;
      padding-right: 0.5em;
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
  `,Kt.listStyles=tt`
    ha-card {
      --list-item-height: 3em;
      --spotify-color: #1db954;
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

    .list-item > img {
      height: var(--list-item-height);
      object-fit: contain;
    }

    .list-item > .icon {
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
  `,Kt.gridStyles=tt`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
      grid-gap: 5px;
    }

    .grid-item {
      position: relative;
      cursor: pointer;
    }

    .grid-item-album-image {
      width: 100%;
      height: auto;
      box-shadow: var(--primary-text-color) 0 0 0.2em;
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
  `,t([J()],Kt.prototype,"hass",void 0),t([J({type:Object})],Kt.prototype,"config",void 0),t([Z()],Kt.prototype,"spotcast_connector",void 0),Kt=Zt=t([B("spotify-card")],Kt);export{Kt as SpotifyCard};
//# sourceMappingURL=spotify-card.js.map
