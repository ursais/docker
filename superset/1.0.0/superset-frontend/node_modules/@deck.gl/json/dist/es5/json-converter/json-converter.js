"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _shallowEqualObjects = require("../utils/shallow-equal-objects.js");

var _parseJson = _interopRequireDefault(require("../parsers/parse-json"));

var _convertJson = require("../parsers/convert-json");

var JSONConverter = function () {
  function JSONConverter(props) {
    (0, _classCallCheck2.default)(this, JSONConverter);
    this.configuration = {};

    this.onJSONChange = function () {};

    this.setProps(props);
  }

  (0, _createClass2.default)(JSONConverter, [{
    key: "finalize",
    value: function finalize() {}
  }, {
    key: "setProps",
    value: function setProps(props) {
      if ('configuration' in props) {
        this.configuration = props.configuration;
      }

      if ('onJSONChange' in props) {
        this.onJSONChange = props.onJSONChange;
      }
    }
  }, {
    key: "convertJsonToDeckProps",
    value: function convertJsonToDeckProps(json) {
      if (!json || json === this.json) {
        return this.deckProps;
      }

      this.json = json;
      var parsedJSON = (0, _parseJson.default)(json);
      var jsonProps = (0, _convertJson.convertTopLevelJSON)(parsedJSON, this.configuration);

      if ('initialViewState' in jsonProps) {
        var updateViewState = !this.initialViewState || !(0, _shallowEqualObjects.shallowEqualObjects)(jsonProps.initialViewState, this.initialViewState);

        if (updateViewState) {
          jsonProps.viewState = jsonProps.initialViewState;
          this.initialViewState = jsonProps.initialViewState;
        }

        delete jsonProps.initialViewState;
      }

      this.deckProps = jsonProps;
      return jsonProps;
    }
  }]);
  return JSONConverter;
}();

exports.default = JSONConverter;
//# sourceMappingURL=json-converter.js.map