"use strict";

exports.__esModule = true;
exports.default = getDatasourceMetadata;

var _connection = require("../../../connection");

function getDatasourceMetadata({
  client = _connection.SupersetClient,
  datasourceKey,
  requestConfig
}) {
  return client.get({
    endpoint: `/superset/fetch_datasource_metadata?datasourceKey=${datasourceKey}`,
    ...requestConfig
  }).then(response => response.json);
}