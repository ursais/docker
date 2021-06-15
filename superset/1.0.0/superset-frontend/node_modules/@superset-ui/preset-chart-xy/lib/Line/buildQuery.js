"use strict";

exports.__esModule = true;
exports.default = buildQuery;

var _core = require("@superset-ui/core");

var _Encoder = require("../components/Line/Encoder");

function buildQuery(formData) {
  const queryContext = (0, _core.buildQueryContext)(formData);
  const {
    encoding
  } = formData;

  const encoder = _Encoder.lineEncoderFactory.create(encoding);

  queryContext.queries.forEach(query => {
    const q = query;
    q.groupby = encoder.getGroupBys(); // Enforce time-series mode

    q.is_timeseries = true;
  });
  return queryContext;
}