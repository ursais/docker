"use strict";

exports.__esModule = true;
exports.default = callApiAndParseWithTimeout;

var _callApi = _interopRequireDefault(require("./callApi"));

var _rejectAfterTimeout = _interopRequireDefault(require("./rejectAfterTimeout"));

var _parseResponse = _interopRequireDefault(require("./parseResponse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function callApiAndParseWithTimeout({
  timeout,
  parseMethod,
  ...rest
}) {
  const apiPromise = (0, _callApi.default)(rest);
  const racedPromise = typeof timeout === 'number' && timeout > 0 ? Promise.race([apiPromise, (0, _rejectAfterTimeout.default)(timeout)]) : apiPromise;
  return (0, _parseResponse.default)(racedPromise, parseMethod);
}