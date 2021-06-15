import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { shallowEqualObjects } from '../utils/shallow-equal-objects.js';
import parseJSON from '../parsers/parse-json';
import { convertTopLevelJSON } from '../parsers/convert-json';

var JSONConverter = function () {
  function JSONConverter(props) {
    _classCallCheck(this, JSONConverter);

    this.configuration = {};

    this.onJSONChange = function () {};

    this.setProps(props);
  }

  _createClass(JSONConverter, [{
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
      var parsedJSON = parseJSON(json);
      var jsonProps = convertTopLevelJSON(parsedJSON, this.configuration);

      if ('initialViewState' in jsonProps) {
        var updateViewState = !this.initialViewState || !shallowEqualObjects(jsonProps.initialViewState, this.initialViewState);

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

export { JSONConverter as default };
//# sourceMappingURL=json-converter.js.map