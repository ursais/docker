"use strict";

exports.__esModule = true;
exports.default = fetchExploreJson;

var _connection = require("../../../connection");

async function fetchExploreJson({
  client = _connection.SupersetClient,
  method = 'POST',
  requestConfig,
  endpoint = '/superset/explore_json/',
  formData
}) {
  const {
    json
  } = await client.request({ ...requestConfig,
    method,
    endpoint,
    searchParams: method === 'GET' ? new URLSearchParams({
      form_data: JSON.stringify(formData)
    }) : undefined,
    postPayload: method === 'POST' ? {
      form_data: formData
    } : undefined
  });
  return json;
}