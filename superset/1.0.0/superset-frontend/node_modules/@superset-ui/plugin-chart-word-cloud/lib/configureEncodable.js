"use strict";

exports.__esModule = true;
exports.default = configureEncodable;

var _encodable = require("encodable");

var _core = require("@superset-ui/core");

const timeFormat = ({
  format,
  formatInLocalTime = false
} = {}) => {
  const formatString = formatInLocalTime ? (0, _encodable.addPrefix)(_core.LOCAL_PREFIX, format != null ? format : (0, _core.getTimeFormatterRegistry)().getDefaultKey()) : format;
  return (0, _core.getTimeFormatter)(formatString);
};

const colorSchemeResolver = ({
  name,
  type = 'categorical'
} = {}) => {
  if (type === 'sequential') {
    const scheme = (0, _core.getSequentialSchemeRegistry)().get(name);
    return typeof scheme === 'undefined' ? scheme : {
      type: 'sequential',
      ...scheme
    };
  }

  if (type === 'categorical') {
    const scheme = (0, _core.getCategoricalSchemeRegistry)().get(name);
    return typeof scheme === 'undefined' ? scheme : {
      type: 'categorical',
      ...scheme
    };
  }

  return (0, _encodable.defaultColorSchemeResolver)({
    name,
    type
  });
};

const colorScaleResolver = ({
  name,
  namespace
} = {}) => _core.CategoricalColorNamespace.getScale(name, namespace);

function configureEncodable() {
  _encodable.Encodable.setNumberFormatResolver(_core.getNumberFormatter).setTimeFormatResolver(timeFormat).setColorSchemeResolver(colorSchemeResolver).setCategoricalColorScaleResolver(colorScaleResolver);
}