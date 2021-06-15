"use strict";

exports.__esModule = true;
exports.default = getFormData;

var _connection = require("../../../connection");

function getFormData({
  client = _connection.SupersetClient,
  sliceId,
  overrideFormData,
  requestConfig
}) {
  const promise = client.get({
    endpoint: `/api/v1/form_data/?slice_id=${sliceId}`,
    ...requestConfig
  }).then(({
    json
  }) => json);
  return overrideFormData ? promise.then(formData => ({ ...formData,
    ...overrideFormData
  })) : promise;
}