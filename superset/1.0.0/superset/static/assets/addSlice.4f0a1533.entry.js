/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"addSlice": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + "." + "4f0a1533" + ".chunk.js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/assets/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([8,"vendors","mathjs","thumbnail",4,5]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/addSlice/AddSliceContainer.tsx":
/*!********************************************!*\
  !*** ./src/addSlice/AddSliceContainer.tsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return AddSliceContainer; });\n/* harmony import */ var _babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/json/stringify */ \"./node_modules/@babel/runtime-corejs3/core-js-stable/json/stringify.js\");\n/* harmony import */ var _babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/bind */ \"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/bind.js\");\n/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var src_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/components/Button */ \"./src/components/Button/index.tsx\");\n/* harmony import */ var src_components_Select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/components/Select */ \"./src/components/Select/index.ts\");\n/* harmony import */ var _superset_ui_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @superset-ui/core */ \"./node_modules/@superset-ui/core/esm/style/index.js\");\n/* harmony import */ var _superset_ui_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @superset-ui/core */ \"./node_modules/@superset-ui/core/esm/translation/TranslatorSingleton.js\");\n/* harmony import */ var _explore_components_controls_VizTypeControl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../explore/components/controls/VizTypeControl */ \"./src/explore/components/controls/VizTypeControl/index.jsx\");\n/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @emotion/react */ \"./node_modules/@emotion/react/dist/emotion-react.browser.esm.js\");\n(function () {var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;enterModule && enterModule(module);})();var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {return a;}; /**\n * Licensed to the Apache Software Foundation (ASF) under one\n * or more contributor license agreements.  See the NOTICE file\n * distributed with this work for additional information\n * regarding copyright ownership.  The ASF licenses this file\n * to you under the Apache License, Version 2.0 (the\n * \"License\"); you may not use this file except in compliance\n * with the License.  You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing,\n * software distributed under the License is distributed on an\n * \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\n * KIND, either express or implied.  See the License for the\n * specific language governing permissions and limitations\n * under the License.\n */\n\n\n\n\n\nconst styleSelectContainer = { width: 600, marginBottom: '10px' };\nconst StyledContainer = _superset_ui_core__WEBPACK_IMPORTED_MODULE_5__[\"styled\"].div`\n  border-radius: ${({ theme }) => theme.gridUnit}px;\n  background-color: ${({ theme }) => theme.colors.grayscale.light5};\n  padding: ${({ theme }) => theme.gridUnit * 6}px;\n  h3 {\n    padding-bottom: ${({ theme }) => theme.gridUnit * 3}px;\n  }\n`;\nclass AddSliceContainer extends react__WEBPACK_IMPORTED_MODULE_2___default.a.PureComponent {\n  constructor(props) {var _context, _context2, _context3;\n    super(props);\n    this.state = {\n      visType: 'table' };\n\n    this.changeDatasource = _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_1___default()(_context = this.changeDatasource).call(_context, this);\n    this.changeVisType = _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_1___default()(_context2 = this.changeVisType).call(_context2, this);\n    this.gotoSlice = _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_1___default()(_context3 = this.gotoSlice).call(_context3, this);\n  }\n  exploreUrl() {\n    const formData = encodeURIComponent(_babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_0___default()({\n      viz_type: this.state.visType,\n      datasource: this.state.datasourceValue }));\n\n    return `/superset/explore/?form_data=${formData}`;\n  }\n  gotoSlice() {\n    window.location.href = this.exploreUrl();\n  }\n  changeDatasource(option) {\n    this.setState({\n      datasourceValue: option.value,\n      datasourceId: option.value.split('__')[0] });\n\n  }\n  changeVisType(visType) {\n    this.setState({ visType });\n  }\n  isBtnDisabled() {\n    return !(this.state.datasourceId && this.state.visType);\n  }\n  render() {\n    return Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(StyledContainer, { className: \"container\" },\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"h3\", null, Object(_superset_ui_core__WEBPACK_IMPORTED_MODULE_6__[\"t\"])('Create a new chart')),\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"div\", null,\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"p\", null, Object(_superset_ui_core__WEBPACK_IMPORTED_MODULE_6__[\"t\"])('Choose a dataset')),\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"div\", { style: styleSelectContainer },\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(src_components_Select__WEBPACK_IMPORTED_MODULE_4__[\"default\"], { clearable: false, ignoreAccents: false, name: \"select-datasource\", onChange: this.changeDatasource, options: this.props.datasources, placeholder: Object(_superset_ui_core__WEBPACK_IMPORTED_MODULE_6__[\"t\"])('Choose a dataset'), value: this.state.datasourceValue ?\n      {\n        value: this.state.datasourceValue } :\n\n      undefined, width: 600 })),\n\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"span\", { className: \"text-muted\" },\n    Object(_superset_ui_core__WEBPACK_IMPORTED_MODULE_6__[\"t\"])('If the dataset you are looking for is not available in the list, follow the instructions on how to add it in the Superset tutorial.'), ' ',\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"a\", { href: \"https://superset.apache.org/docs/creating-charts-dashboards/first-dashboard#adding-a-new-table\", rel: \"noopener noreferrer\", target: \"_blank\" },\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"i\", { className: \"fa fa-external-link\" })))),\n\n\n\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"br\", null),\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"div\", null,\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"p\", null, Object(_superset_ui_core__WEBPACK_IMPORTED_MODULE_6__[\"t\"])('Choose a visualization type')),\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(_explore_components_controls_VizTypeControl__WEBPACK_IMPORTED_MODULE_7__[\"default\"], { name: \"select-vis-type\", onChange: this.changeVisType, value: this.state.visType, labelType: \"primary\" })),\n\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"br\", null),\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"hr\", null),\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(src_components_Button__WEBPACK_IMPORTED_MODULE_3__[\"default\"], { buttonStyle: \"primary\", disabled: this.isBtnDisabled(), onClick: this.gotoSlice },\n    Object(_superset_ui_core__WEBPACK_IMPORTED_MODULE_6__[\"t\"])('Create new chart')),\n\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"br\", null),\n    Object(_emotion_react__WEBPACK_IMPORTED_MODULE_8__[\"jsx\"])(\"br\", null));\n\n  } // @ts-ignore\n  __reactstandin__regenerateByEval(key, code) {// @ts-ignore\n    this[key] = eval(code);}};(function () {var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;if (!reactHotLoader) {return;}reactHotLoader.register(styleSelectContainer, \"styleSelectContainer\", \"/app/superset-frontend/src/addSlice/AddSliceContainer.tsx\");reactHotLoader.register(StyledContainer, \"StyledContainer\", \"/app/superset-frontend/src/addSlice/AddSliceContainer.tsx\");reactHotLoader.register(AddSliceContainer, \"AddSliceContainer\", \"/app/superset-frontend/src/addSlice/AddSliceContainer.tsx\");})();;(function () {var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;leaveModule && leaveModule(module);})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYWRkU2xpY2UvQWRkU2xpY2VDb250YWluZXIudHN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FkZFNsaWNlL0FkZFNsaWNlQ29udGFpbmVyLnRzeD80MDc2Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJ3NyYy9jb21wb25lbnRzL0J1dHRvbic7XG5pbXBvcnQgU2VsZWN0IGZyb20gJ3NyYy9jb21wb25lbnRzL1NlbGVjdCc7XG5pbXBvcnQgeyBzdHlsZWQsIHQgfSBmcm9tICdAc3VwZXJzZXQtdWkvY29yZSc7XG5cbmltcG9ydCBWaXpUeXBlQ29udHJvbCBmcm9tICcuLi9leHBsb3JlL2NvbXBvbmVudHMvY29udHJvbHMvVml6VHlwZUNvbnRyb2wnO1xuXG5pbnRlcmZhY2UgRGF0YXNvdXJjZSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHZhbHVlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIEFkZFNsaWNlQ29udGFpbmVyUHJvcHMgPSB7XG4gIGRhdGFzb3VyY2VzOiBEYXRhc291cmNlW107XG59O1xuXG5leHBvcnQgdHlwZSBBZGRTbGljZUNvbnRhaW5lclN0YXRlID0ge1xuICBkYXRhc291cmNlSWQ/OiBzdHJpbmc7XG4gIGRhdGFzb3VyY2VUeXBlPzogc3RyaW5nO1xuICBkYXRhc291cmNlVmFsdWU/OiBzdHJpbmc7XG4gIHZpc1R5cGU6IHN0cmluZztcbn07XG5cbmNvbnN0IHN0eWxlU2VsZWN0Q29udGFpbmVyID0geyB3aWR0aDogNjAwLCBtYXJnaW5Cb3R0b206ICcxMHB4JyB9O1xuY29uc3QgU3R5bGVkQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgYm9yZGVyLXJhZGl1czogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5ncmlkVW5pdH1weDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5jb2xvcnMuZ3JheXNjYWxlLmxpZ2h0NX07XG4gIHBhZGRpbmc6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuZ3JpZFVuaXQgKiA2fXB4O1xuICBoMyB7XG4gICAgcGFkZGluZy1ib3R0b206ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUuZ3JpZFVuaXQgKiAzfXB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGRTbGljZUNvbnRhaW5lciBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQ8XG4gIEFkZFNsaWNlQ29udGFpbmVyUHJvcHMsXG4gIEFkZFNsaWNlQ29udGFpbmVyU3RhdGVcbj4ge1xuICBjb25zdHJ1Y3Rvcihwcm9wczogQWRkU2xpY2VDb250YWluZXJQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmlzVHlwZTogJ3RhYmxlJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jaGFuZ2VEYXRhc291cmNlID0gdGhpcy5jaGFuZ2VEYXRhc291cmNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGFuZ2VWaXNUeXBlID0gdGhpcy5jaGFuZ2VWaXNUeXBlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nb3RvU2xpY2UgPSB0aGlzLmdvdG9TbGljZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZXhwbG9yZVVybCgpIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IGVuY29kZVVSSUNvbXBvbmVudChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgdml6X3R5cGU6IHRoaXMuc3RhdGUudmlzVHlwZSxcbiAgICAgICAgZGF0YXNvdXJjZTogdGhpcy5zdGF0ZS5kYXRhc291cmNlVmFsdWUsXG4gICAgICB9KSxcbiAgICApO1xuICAgIHJldHVybiBgL3N1cGVyc2V0L2V4cGxvcmUvP2Zvcm1fZGF0YT0ke2Zvcm1EYXRhfWA7XG4gIH1cblxuICBnb3RvU2xpY2UoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmV4cGxvcmVVcmwoKTtcbiAgfVxuXG4gIGNoYW5nZURhdGFzb3VyY2Uob3B0aW9uOiB7IHZhbHVlOiBzdHJpbmcgfSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGF0YXNvdXJjZVZhbHVlOiBvcHRpb24udmFsdWUsXG4gICAgICBkYXRhc291cmNlSWQ6IG9wdGlvbi52YWx1ZS5zcGxpdCgnX18nKVswXSxcbiAgICB9KTtcbiAgfVxuXG4gIGNoYW5nZVZpc1R5cGUodmlzVHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc1R5cGUgfSk7XG4gIH1cblxuICBpc0J0bkRpc2FibGVkKCkge1xuICAgIHJldHVybiAhKHRoaXMuc3RhdGUuZGF0YXNvdXJjZUlkICYmIHRoaXMuc3RhdGUudmlzVHlwZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRDb250YWluZXIgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxoMz57dCgnQ3JlYXRlIGEgbmV3IGNoYXJ0Jyl9PC9oMz5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8cD57dCgnQ2hvb3NlIGEgZGF0YXNldCcpfTwvcD5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZVNlbGVjdENvbnRhaW5lcn0+XG4gICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgIGNsZWFyYWJsZT17ZmFsc2V9XG4gICAgICAgICAgICAgIGlnbm9yZUFjY2VudHM9e2ZhbHNlfVxuICAgICAgICAgICAgICBuYW1lPVwic2VsZWN0LWRhdGFzb3VyY2VcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5jaGFuZ2VEYXRhc291cmNlfVxuICAgICAgICAgICAgICBvcHRpb25zPXt0aGlzLnByb3BzLmRhdGFzb3VyY2VzfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnQ2hvb3NlIGEgZGF0YXNldCcpfVxuICAgICAgICAgICAgICB2YWx1ZT17XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5kYXRhc291cmNlVmFsdWVcbiAgICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnN0YXRlLmRhdGFzb3VyY2VWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB3aWR0aD17NjAwfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkXCI+XG4gICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgJ0lmIHRoZSBkYXRhc2V0IHlvdSBhcmUgbG9va2luZyBmb3IgaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgbGlzdCwgZm9sbG93IHRoZSBpbnN0cnVjdGlvbnMgb24gaG93IHRvIGFkZCBpdCBpbiB0aGUgU3VwZXJzZXQgdHV0b3JpYWwuJyxcbiAgICAgICAgICAgICl9eycgJ31cbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3N1cGVyc2V0LmFwYWNoZS5vcmcvZG9jcy9jcmVhdGluZy1jaGFydHMtZGFzaGJvYXJkcy9maXJzdC1kYXNoYm9hcmQjYWRkaW5nLWEtbmV3LXRhYmxlXCJcbiAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWV4dGVybmFsLWxpbmtcIiAvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxiciAvPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxwPnt0KCdDaG9vc2UgYSB2aXN1YWxpemF0aW9uIHR5cGUnKX08L3A+XG4gICAgICAgICAgPFZpelR5cGVDb250cm9sXG4gICAgICAgICAgICBuYW1lPVwic2VsZWN0LXZpcy10eXBlXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmNoYW5nZVZpc1R5cGV9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52aXNUeXBlfVxuICAgICAgICAgICAgbGFiZWxUeXBlPVwicHJpbWFyeVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxiciAvPlxuICAgICAgICA8aHIgLz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGJ1dHRvblN0eWxlPVwicHJpbWFyeVwiXG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMuaXNCdG5EaXNhYmxlZCgpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZ290b1NsaWNlfVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ0NyZWF0ZSBuZXcgY2hhcnQnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxiciAvPlxuICAgICAgICA8YnIgLz5cbiAgICAgIDwvU3R5bGVkQ29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBR0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFyR0E7QUFBQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/addSlice/AddSliceContainer.tsx\n");

/***/ }),

/***/ "./src/addSlice/App.tsx":
/*!******************************!*\
  !*** ./src/addSlice/App.tsx ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_hot_loader_root__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-hot-loader/root */ \"./node_modules/react-hot-loader/root.js\");\n/* harmony import */ var react_hot_loader_root__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_hot_loader_root__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _superset_ui_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @superset-ui/core */ \"./node_modules/@emotion/react/dist/emotion-element-4fbd89c5.browser.esm.js\");\n/* harmony import */ var _setup_setupApp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setup/setupApp */ \"./src/setup/setupApp.ts\");\n/* harmony import */ var _setup_setupPlugins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setup/setupPlugins */ \"./src/setup/setupPlugins.ts\");\n/* harmony import */ var _components_DynamicPlugins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/DynamicPlugins */ \"./src/components/DynamicPlugins/index.tsx\");\n/* harmony import */ var _AddSliceContainer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AddSliceContainer */ \"./src/addSlice/AddSliceContainer.tsx\");\n/* harmony import */ var _featureFlags__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../featureFlags */ \"./src/featureFlags.ts\");\n/* harmony import */ var _preamble__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../preamble */ \"./src/preamble.ts\");\n/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @emotion/react */ \"./node_modules/@emotion/react/dist/emotion-react.browser.esm.js\");\n(function () {var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;enterModule && enterModule(module);})();var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {return a;}; /**\n * Licensed to the Apache Software Foundation (ASF) under one\n * or more contributor license agreements.  See the NOTICE file\n * distributed with this work for additional information\n * regarding copyright ownership.  The ASF licenses this file\n * to you under the Apache License, Version 2.0 (the\n * \"License\"); you may not use this file except in compliance\n * with the License.  You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing,\n * software distributed under the License is distributed on an\n * \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\n * KIND, either express or implied.  See the License for the\n * specific language governing permissions and limitations\n * under the License.\n */\n\n\n\n\n\n\n\n\n\nObject(_setup_setupApp__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\nObject(_setup_setupPlugins__WEBPACK_IMPORTED_MODULE_4__[\"default\"])();\nconst addSliceContainer = document.getElementById('app');\nconst bootstrapData = JSON.parse((addSliceContainer == null ? void 0 : addSliceContainer.getAttribute('data-bootstrap')) || '{}');\nObject(_featureFlags__WEBPACK_IMPORTED_MODULE_7__[\"initFeatureFlags\"])(bootstrapData.common.feature_flags);\nconst App = () => Object(_emotion_react__WEBPACK_IMPORTED_MODULE_9__[\"jsx\"])(_superset_ui_core__WEBPACK_IMPORTED_MODULE_2__[\"a\"], { theme: _preamble__WEBPACK_IMPORTED_MODULE_8__[\"theme\"] },\nObject(_emotion_react__WEBPACK_IMPORTED_MODULE_9__[\"jsx\"])(_components_DynamicPlugins__WEBPACK_IMPORTED_MODULE_5__[\"DynamicPluginProvider\"], null,\nObject(_emotion_react__WEBPACK_IMPORTED_MODULE_9__[\"jsx\"])(_AddSliceContainer__WEBPACK_IMPORTED_MODULE_6__[\"default\"], { datasources: bootstrapData.datasources })));const _default =\n\n\nObject(react_hot_loader_root__WEBPACK_IMPORTED_MODULE_1__[\"hot\"])(App);/* harmony default export */ __webpack_exports__[\"default\"] = (_default);;(function () {var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;if (!reactHotLoader) {return;}reactHotLoader.register(addSliceContainer, \"addSliceContainer\", \"/app/superset-frontend/src/addSlice/App.tsx\");reactHotLoader.register(bootstrapData, \"bootstrapData\", \"/app/superset-frontend/src/addSlice/App.tsx\");reactHotLoader.register(App, \"App\", \"/app/superset-frontend/src/addSlice/App.tsx\");reactHotLoader.register(_default, \"default\", \"/app/superset-frontend/src/addSlice/App.tsx\");})();;(function () {var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;leaveModule && leaveModule(module);})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYWRkU2xpY2UvQXBwLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9hZGRTbGljZS9BcHAudHN4P2UwMTIiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBMaWNlbnNlZCB0byB0aGUgQXBhY2hlIFNvZnR3YXJlIEZvdW5kYXRpb24gKEFTRikgdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gIFNlZSB0aGUgTk9USUNFIGZpbGVcbiAqIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyB3b3JrIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC4gIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlXG4gKiB0byB5b3UgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlXG4gKiBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbiAqIHdpdGggdGhlIExpY2Vuc2UuICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGhvdCB9IGZyb20gJ3JlYWN0LWhvdC1sb2FkZXIvcm9vdCc7XG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnQHN1cGVyc2V0LXVpL2NvcmUnO1xuaW1wb3J0IHNldHVwQXBwIGZyb20gJy4uL3NldHVwL3NldHVwQXBwJztcbmltcG9ydCBzZXR1cFBsdWdpbnMgZnJvbSAnLi4vc2V0dXAvc2V0dXBQbHVnaW5zJztcbmltcG9ydCB7IER5bmFtaWNQbHVnaW5Qcm92aWRlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvRHluYW1pY1BsdWdpbnMnO1xuaW1wb3J0IEFkZFNsaWNlQ29udGFpbmVyIGZyb20gJy4vQWRkU2xpY2VDb250YWluZXInO1xuaW1wb3J0IHsgaW5pdEZlYXR1cmVGbGFncyB9IGZyb20gJy4uL2ZlYXR1cmVGbGFncyc7XG5pbXBvcnQgeyB0aGVtZSB9IGZyb20gJy4uL3ByZWFtYmxlJztcblxuc2V0dXBBcHAoKTtcbnNldHVwUGx1Z2lucygpO1xuXG5jb25zdCBhZGRTbGljZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcbmNvbnN0IGJvb3RzdHJhcERhdGEgPSBKU09OLnBhcnNlKFxuICBhZGRTbGljZUNvbnRhaW5lcj8uZ2V0QXR0cmlidXRlKCdkYXRhLWJvb3RzdHJhcCcpIHx8ICd7fScsXG4pO1xuXG5pbml0RmVhdHVyZUZsYWdzKGJvb3RzdHJhcERhdGEuY29tbW9uLmZlYXR1cmVfZmxhZ3MpO1xuXG5jb25zdCBBcHAgPSAoKSA9PiAoXG4gIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGVtZX0+XG4gICAgPER5bmFtaWNQbHVnaW5Qcm92aWRlcj5cbiAgICAgIDxBZGRTbGljZUNvbnRhaW5lciBkYXRhc291cmNlcz17Ym9vdHN0cmFwRGF0YS5kYXRhc291cmNlc30gLz5cbiAgICA8L0R5bmFtaWNQbHVnaW5Qcm92aWRlcj5cbiAgPC9UaGVtZVByb3ZpZGVyPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgaG90KEFwcCk7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/addSlice/App.tsx\n");

/***/ }),

/***/ "./src/addSlice/index.tsx":
/*!********************************!*\
  !*** ./src/addSlice/index.tsx ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"./node_modules/@hot-loader/react-dom/index.js\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ \"./src/addSlice/App.tsx\");\n/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/react */ \"./node_modules/@emotion/react/dist/emotion-react.browser.esm.js\");\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {return a;}; /**\n * Licensed to the Apache Software Foundation (ASF) under one\n * or more contributor license agreements.  See the NOTICE file\n * distributed with this work for additional information\n * regarding copyright ownership.  The ASF licenses this file\n * to you under the Apache License, Version 2.0 (the\n * \"License\"); you may not use this file except in compliance\n * with the License.  You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing,\n * software distributed under the License is distributed on an\n * \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\n * KIND, either express or implied.  See the License for the\n * specific language governing permissions and limitations\n * under the License.\n */\n\n\n\nreact_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(Object(_emotion_react__WEBPACK_IMPORTED_MODULE_3__[\"jsx\"])(_App__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null), document.getElementById('app'));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYWRkU2xpY2UvaW5kZXgudHN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FkZFNsaWNlL2luZGV4LnRzeD9kNWY5Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlXG4gKiBkaXN0cmlidXRlZCB3aXRoIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogcmVnYXJkaW5nIGNvcHlyaWdodCBvd25lcnNoaXAuICBUaGUgQVNGIGxpY2Vuc2VzIHRoaXMgZmlsZVxuICogdG8geW91IHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZVxuICogXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG4gKiB3aXRoIHRoZSBMaWNlbnNlLiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsXG4gKiBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhblxuICogXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbiAqIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAnO1xuXG5SZWFjdERPTS5yZW5kZXIoPEFwcCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFFQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/addSlice/index.tsx\n");

/***/ }),

/***/ 8:
/*!********************************************************************************************************!*\
  !*** multi webpack-dev-server/client?http://localhost:9000 ./src/preamble.ts ./src/addSlice/index.tsx ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack-dev-server/client?http://localhost:9000 */"./node_modules/webpack-dev-server/client/index.js?http://localhost:9000");
__webpack_require__(/*! /app/superset-frontend/src/preamble.ts */"./src/preamble.ts");
module.exports = __webpack_require__(/*! /app/superset-frontend/src/addSlice/index.tsx */"./src/addSlice/index.tsx");


/***/ })

/******/ });