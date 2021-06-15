import { shallowEqualObjects } from '../utils/shallow-equal-objects.js';
import parseJSON from '../parsers/parse-json';
import { convertTopLevelJSON } from '../parsers/convert-json';
export default class JSONConverter {
  constructor(props) {
    this.configuration = {};

    this.onJSONChange = () => {};

    this.setProps(props);
  }

  finalize() {}

  setProps(props) {
    if ('configuration' in props) {
      this.configuration = props.configuration;
    }

    if ('onJSONChange' in props) {
      this.onJSONChange = props.onJSONChange;
    }
  }

  convertJsonToDeckProps(json) {
    if (!json || json === this.json) {
      return this.deckProps;
    }

    this.json = json;
    const parsedJSON = parseJSON(json);
    const jsonProps = convertTopLevelJSON(parsedJSON, this.configuration);

    if ('initialViewState' in jsonProps) {
      const updateViewState = !this.initialViewState || !shallowEqualObjects(jsonProps.initialViewState, this.initialViewState);

      if (updateViewState) {
        jsonProps.viewState = jsonProps.initialViewState;
        this.initialViewState = jsonProps.initialViewState;
      }

      delete jsonProps.initialViewState;
    }

    this.deckProps = jsonProps;
    return jsonProps;
  }

}
//# sourceMappingURL=json-converter.js.map