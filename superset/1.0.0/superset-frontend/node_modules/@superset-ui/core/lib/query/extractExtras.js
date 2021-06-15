"use strict";

exports.__esModule = true;
exports.default = extractExtras;

var _types = require("./types");

/* eslint-disable camelcase */
function extractExtras(formData) {
  const applied_time_extras = {};
  const filters = [];
  const extras = {};
  const extract = {
    filters,
    extras,
    applied_time_extras
  };
  const reservedColumnsToQueryField = {
    __time_range: 'time_range',
    __time_col: 'granularity_sqla',
    __time_grain: 'time_grain_sqla',
    __time_origin: 'druid_time_origin',
    __granularity: 'granularity'
  };
  (formData.extra_filters || []).forEach(filter => {
    if (filter.col in reservedColumnsToQueryField) {
      const key = filter.col;
      const queryField = reservedColumnsToQueryField[key];
      extract[queryField] = filter.val;
      applied_time_extras[key] = filter.val;
    } else {
      filters.push(filter);
    }
  }); // map to undeprecated names and remove deprecated fields

  if ((0, _types.isDruidFormData)(formData) && !extract.druid_time_origin) {
    extras.druid_time_origin = formData.druid_time_origin;
    delete extract.druid_time_origin;
  } else {
    // SQL
    extras.time_grain_sqla = extract.time_grain_sqla || formData.time_grain_sqla;
    extract.granularity = extract.granularity_sqla || formData.granularity || formData.granularity_sqla;
    delete extract.granularity_sqla;
    delete extract.time_grain_sqla;
  } // map time range endpoints:


  if (formData.time_range_endpoints) extras.time_range_endpoints = formData.time_range_endpoints;
  return extract;
}