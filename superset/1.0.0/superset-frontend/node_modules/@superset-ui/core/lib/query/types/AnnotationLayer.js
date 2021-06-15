"use strict";

exports.__esModule = true;
exports.isFormulaAnnotationLayer = isFormulaAnnotationLayer;
exports.isEventAnnotationLayer = isEventAnnotationLayer;
exports.isIntervalAnnotationLayer = isIntervalAnnotationLayer;
exports.isTimeseriesAnnotationLayer = isTimeseriesAnnotationLayer;
exports.isTableAnnotationLayer = isTableAnnotationLayer;
exports.isTimeseriesAnnotationResult = isTimeseriesAnnotationResult;
exports.isRecordAnnotationResult = isRecordAnnotationResult;
exports.AnnotationStyle = exports.AnnotationOpacity = exports.AnnotationSourceType = exports.AnnotationType = void 0;

/* eslint camelcase: 0 */
let AnnotationType;
exports.AnnotationType = AnnotationType;

(function (AnnotationType) {
  AnnotationType["Event"] = "EVENT";
  AnnotationType["Formula"] = "FORMULA";
  AnnotationType["Interval"] = "INTERVAL";
  AnnotationType["Timeseries"] = "TIME_SERIES";
})(AnnotationType || (exports.AnnotationType = AnnotationType = {}));

let AnnotationSourceType;
exports.AnnotationSourceType = AnnotationSourceType;

(function (AnnotationSourceType) {
  AnnotationSourceType["Line"] = "line";
  AnnotationSourceType["Native"] = "NATIVE";
  AnnotationSourceType["Table"] = "table";
  AnnotationSourceType["Undefined"] = "";
})(AnnotationSourceType || (exports.AnnotationSourceType = AnnotationSourceType = {}));

let AnnotationOpacity;
exports.AnnotationOpacity = AnnotationOpacity;

(function (AnnotationOpacity) {
  AnnotationOpacity["High"] = "opacityHigh";
  AnnotationOpacity["Low"] = "opacityLow";
  AnnotationOpacity["Medium"] = "opacityMedium";
  AnnotationOpacity["Undefined"] = "";
})(AnnotationOpacity || (exports.AnnotationOpacity = AnnotationOpacity = {}));

let AnnotationStyle;
exports.AnnotationStyle = AnnotationStyle;

(function (AnnotationStyle) {
  AnnotationStyle["Dashed"] = "dashed";
  AnnotationStyle["Dotted"] = "dotted";
  AnnotationStyle["Solid"] = "solid";
  AnnotationStyle["LongDashed"] = "longDashed";
})(AnnotationStyle || (exports.AnnotationStyle = AnnotationStyle = {}));

function isFormulaAnnotationLayer(layer) {
  return layer.annotationType === AnnotationType.Formula;
}

function isEventAnnotationLayer(layer) {
  return layer.annotationType === AnnotationType.Event;
}

function isIntervalAnnotationLayer(layer) {
  return layer.annotationType === AnnotationType.Interval;
}

function isTimeseriesAnnotationLayer(layer) {
  return layer.annotationType === AnnotationType.Timeseries;
}

function isTableAnnotationLayer(layer) {
  return layer.sourceType === AnnotationSourceType.Table;
}

function isTimeseriesAnnotationResult(result) {
  return Array.isArray(result);
}

function isRecordAnnotationResult(result) {
  return 'columns' in result && 'records' in result;
}