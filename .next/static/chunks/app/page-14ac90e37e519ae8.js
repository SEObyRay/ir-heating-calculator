(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{9319:function(e,s,t){Promise.resolve().then(t.bind(t,2914))},2914:function(e,s,t){"use strict";t.r(s),t.d(s,{default:function(){return o}});var r=t(7437),n=t(2265);let a=()=>.28;function o(){let[e,s]=(0,n.useState)(0),[t,o]=(0,n.useState)("goed"),[l,d]=(0,n.useState)(6),[i,c]=(0,n.useState)(null),u=function(){let e=a();return{prijs:e,laatstBijgewerkt:new Date}}().prijs;return(0,r.jsxs)("div",{className:"max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md",children:[(0,r.jsx)("h2",{className:"text-2xl font-bold mb-6",children:"Bereken uw infrarood verwarming"}),(0,r.jsxs)("div",{className:"space-y-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"Oppervlakte (m\xb2)"}),(0,r.jsx)("input",{type:"number",min:"0",value:e||"",onChange:e=>s(Number(e.target.value)),className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"Isolatie"}),(0,r.jsxs)("select",{value:t,onChange:e=>o(e.target.value),className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500",children:[(0,r.jsx)("option",{value:"goed",children:"Goed ge\xefsoleerd"}),(0,r.jsx)("option",{value:"matig",children:"Matig ge\xefsoleerd"}),(0,r.jsx)("option",{value:"slecht",children:"Slecht ge\xefsoleerd"})]})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"Gebruiksuren per dag"}),(0,r.jsx)("input",{type:"number",min:"0",max:"24",value:l,onChange:e=>d(Number(e.target.value)),className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"})]}),(0,r.jsx)("button",{onClick:()=>{let s=e*({goed:60,matig:80,slecht:100})[t],r=Math.ceil(s/600),n=s/1e3,a=n*u,o=a*l,d=30*o;c({aantalPanelen:r,totaalWattage:s,kostenPerUur:a,kostenPerDag:o,kostenPerMaand:d})},className:"w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",children:"Bereken"})]}),i&&(0,r.jsxs)("div",{className:"mt-6 p-4 bg-orange-50 rounded-md",children:[(0,r.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Resultaat"}),(0,r.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,r.jsxs)("p",{children:["Benodigd aantal panelen (600W): ",(0,r.jsx)("span",{className:"font-semibold",children:i.aantalPanelen})]}),(0,r.jsxs)("p",{children:["Totaal wattage: ",(0,r.jsxs)("span",{className:"font-semibold",children:[i.totaalWattage,"W"]})]}),(0,r.jsxs)("p",{children:["Stroomkosten per uur: ",(0,r.jsxs)("span",{className:"font-semibold",children:["€",i.kostenPerUur.toFixed(2)]})]}),(0,r.jsxs)("p",{children:["Stroomkosten per dag: ",(0,r.jsxs)("span",{className:"font-semibold",children:["€",i.kostenPerDag.toFixed(2)]})]}),(0,r.jsxs)("p",{children:["Geschatte stroomkosten per maand: ",(0,r.jsxs)("span",{className:"font-semibold",children:["€",i.kostenPerMaand.toFixed(2)]})]}),(0,r.jsxs)("p",{className:"text-xs text-gray-500 mt-2",children:["* Berekend met huidige stroomprijs van €",u.toFixed(2),"/kWh"]})]})]})]})}},622:function(e,s,t){"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=t(2265),n=Symbol.for("react.element"),a=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function d(e,s,t){var r,d={},i=null,c=null;for(r in void 0!==t&&(i=""+t),void 0!==s.key&&(i=""+s.key),void 0!==s.ref&&(c=s.ref),s)a.call(s,r)&&!l.hasOwnProperty(r)&&(d[r]=s[r]);if(e&&e.defaultProps)for(r in s=e.defaultProps)void 0===d[r]&&(d[r]=s[r]);return{$$typeof:n,type:e,key:i,ref:c,props:d,_owner:o.current}}s.jsx=d,s.jsxs=d},7437:function(e,s,t){"use strict";e.exports=t(622)}},function(e){e.O(0,[971,596,744],function(){return e(e.s=9319)}),_N_E=e.O()}]);