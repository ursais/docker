"use strict";

exports.__esModule = true;
exports.default = void 0;

var _createMultiFormatter = _interopRequireDefault(require("../factories/createMultiFormatter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const smartDateDetailedFormatter = (0, _createMultiFormatter.default)({
  id: 'smart_date_detailed',
  label: 'Detailed adaptive formatter',
  formats: {
    millisecond: '%Y-%m-%d %H:%M:%S.%L',
    second: '%Y-%m-%d %H:%M:%S',
    minute: '%Y-%m-%d %H:%M',
    hour: '%Y-%m-%d %H:%M',
    day: '%Y-%m-%d',
    week: '%Y-%m-%d',
    month: '%Y-%m-%d',
    year: '%Y'
  }
});
var _default = smartDateDetailedFormatter;
exports.default = _default;