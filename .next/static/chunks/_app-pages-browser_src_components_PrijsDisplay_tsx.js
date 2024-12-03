"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["_app-pages-browser_src_components_PrijsDisplay_tsx"],{

/***/ "(app-pages-browser)/./src/components/PrijsDisplay.tsx":
/*!*****************************************!*\
  !*** ./src/components/PrijsDisplay.tsx ***!
  \*****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ PrijsDisplay; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _context_StroomprijsContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/StroomprijsContext */ \"(app-pages-browser)/./src/context/StroomprijsContext.tsx\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\nfunction PrijsDisplay() {\n    _s();\n    const { stroomprijs, laatstBijgewerkt } = (0,_context_StroomprijsContext__WEBPACK_IMPORTED_MODULE_1__.useStroomprijs)();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"text-sm text-gray-600 bg-blue-50 p-3 rounded-md\",\n        children: [\n            \"Huidige stroomprijs: €\",\n            stroomprijs.toFixed(2),\n            \"/kWh\",\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                className: \"text-xs text-gray-500 ml-2\",\n                children: [\n                    \"Laatst bijgewerkt: \",\n                    laatstBijgewerkt.toLocaleString(\"nl-NL\")\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/raygritter/CascadeProjects/ir-heating-calculator-github/src/components/PrijsDisplay.tsx\",\n                lineNumber: 11,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/raygritter/CascadeProjects/ir-heating-calculator-github/src/components/PrijsDisplay.tsx\",\n        lineNumber: 9,\n        columnNumber: 5\n    }, this);\n}\n_s(PrijsDisplay, \"EqH8PNWuaKb1CV4sJ2kvSpPrVAw=\", false, function() {\n    return [\n        _context_StroomprijsContext__WEBPACK_IMPORTED_MODULE_1__.useStroomprijs\n    ];\n});\n_c = PrijsDisplay;\nvar _c;\n$RefreshReg$(_c, \"PrijsDisplay\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL1ByaWpzRGlzcGxheS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFK0Q7QUFFaEQsU0FBU0M7O0lBQ3RCLE1BQU0sRUFBRUMsV0FBVyxFQUFFQyxnQkFBZ0IsRUFBRSxHQUFHSCwyRUFBY0E7SUFFeEQscUJBQ0UsOERBQUNJO1FBQUlDLFdBQVU7O1lBQWtEO1lBQ3hDSCxZQUFZSSxPQUFPLENBQUM7WUFBRzswQkFDOUMsOERBQUNDO2dCQUFLRixXQUFVOztvQkFBNkI7b0JBQ3ZCRixpQkFBaUJLLGNBQWMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQUk1RDtHQVh3QlA7O1FBQ29CRCx1RUFBY0E7OztLQURsQ0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbXBvbmVudHMvUHJpanNEaXNwbGF5LnRzeD9iMDZmIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IHsgdXNlU3Ryb29tcHJpanMgfSBmcm9tICcuLi9jb250ZXh0L1N0cm9vbXByaWpzQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByaWpzRGlzcGxheSgpIHtcbiAgY29uc3QgeyBzdHJvb21wcmlqcywgbGFhdHN0QmlqZ2V3ZXJrdCB9ID0gdXNlU3Ryb29tcHJpanMoKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNjAwIGJnLWJsdWUtNTAgcC0zIHJvdW5kZWQtbWRcIj5cbiAgICAgIEh1aWRpZ2Ugc3Ryb29tcHJpanM6IOKCrHtzdHJvb21wcmlqcy50b0ZpeGVkKDIpfS9rV2hcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMCBtbC0yXCI+XG4gICAgICAgIExhYXRzdCBiaWpnZXdlcmt0OiB7bGFhdHN0QmlqZ2V3ZXJrdC50b0xvY2FsZVN0cmluZygnbmwtTkwnKX1cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJ1c2VTdHJvb21wcmlqcyIsIlByaWpzRGlzcGxheSIsInN0cm9vbXByaWpzIiwibGFhdHN0QmlqZ2V3ZXJrdCIsImRpdiIsImNsYXNzTmFtZSIsInRvRml4ZWQiLCJzcGFuIiwidG9Mb2NhbGVTdHJpbmciXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/PrijsDisplay.tsx\n"));

/***/ })

}]);