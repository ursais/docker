import { Encodable, defaultColorSchemeResolver, addPrefix } from 'encodable';
import { CategoricalColorNamespace, getCategoricalSchemeRegistry, getSequentialSchemeRegistry, getNumberFormatter, getTimeFormatter, LOCAL_PREFIX, getTimeFormatterRegistry } from '@superset-ui/core';

const timeFormat = ({
  format,
  formatInLocalTime = false
} = {}) => {
  const formatString = formatInLocalTime ? addPrefix(LOCAL_PREFIX, format != null ? format : getTimeFormatterRegistry().getDefaultKey()) : format;
  return getTimeFormatter(formatString);
};

const colorSchemeResolver = ({
  name,
  type = 'categorical'
} = {}) => {
  if (type === 'sequential') {
    const scheme = getSequentialSchemeRegistry().get(name);
    return typeof scheme === 'undefined' ? scheme : {
      type: 'sequential',
      ...scheme
    };
  }

  if (type === 'categorical') {
    const scheme = getCategoricalSchemeRegistry().get(name);
    return typeof scheme === 'undefined' ? scheme : {
      type: 'categorical',
      ...scheme
    };
  }

  return defaultColorSchemeResolver({
    name,
    type
  });
};

const colorScaleResolver = ({
  name,
  namespace
} = {}) => CategoricalColorNamespace.getScale(name, namespace);

export default function configureEncodable() {
  Encodable.setNumberFormatResolver(getNumberFormatter).setTimeFormatResolver(timeFormat).setColorSchemeResolver(colorSchemeResolver).setCategoricalColorScaleResolver(colorScaleResolver);
}