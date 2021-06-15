/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { CategoricalColorNamespace, getMetricLabel, getNumberFormatter, getTimeFormatter } from '@superset-ui/core';
import { DEFAULT_FORM_DATA as DEFAULT_RADAR_FORM_DATA, EchartsRadarLabelType } from './types';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import { extractGroupbyLabel, getColtypesMapping, getLegendProps } from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';
export function formatLabel({
  params,
  labelType,
  numberFormatter
}) {
  const {
    name = '',
    value
  } = params;
  const formattedValue = numberFormatter(value);

  switch (labelType) {
    case EchartsRadarLabelType.Value:
      return formattedValue;

    case EchartsRadarLabelType.KeyValue:
      return `${name}: ${formattedValue}`;

    default:
      return name;
  }
}
export default function transformProps(chartProps) {
  const {
    formData,
    height,
    hooks,
    filterState,
    queriesData,
    width
  } = chartProps;
  const {
    data = []
  } = queriesData[0];
  const coltypeMapping = getColtypesMapping(queriesData[0]);
  const {
    colorScheme,
    groupby,
    labelType,
    labelPosition,
    legendOrientation,
    legendType,
    metrics = [],
    numberFormat,
    dateFormat,
    showLabels,
    showLegend,
    isCircle,
    columnConfig
  } = { ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_RADAR_FORM_DATA,
    ...formData
  };
  const {
    setDataMask = () => {}
  } = hooks;
  const colorFn = CategoricalColorNamespace.getScale(colorScheme);
  const numberFormatter = getNumberFormatter(numberFormat);

  const formatter = params => formatLabel({
    params,
    numberFormatter,
    labelType
  });

  const metricsLabel = metrics.map(metric => getMetricLabel(metric));
  const columnsLabelMap = new Map();
  const transformedData = [];
  data.forEach(datum => {
    const joinedName = extractGroupbyLabel({
      datum,
      groupby,
      coltypeMapping,
      timeFormatter: getTimeFormatter(dateFormat)
    }); // map(joined_name: [columnLabel_1, columnLabel_2, ...])

    columnsLabelMap.set(joinedName, groupby.map(col => datum[col])); // generate transformedData

    transformedData.push({
      value: metricsLabel.map(metricLabel => datum[metricLabel]),
      name: joinedName,
      itemStyle: {
        color: colorFn(joinedName)
      },
      label: {
        show: showLabels,
        position: labelPosition,
        formatter
      }
    });
  });
  const selectedValues = (filterState.selectedValues || []).reduce((acc, selectedValue) => {
    const index = transformedData.findIndex(({
      name
    }) => name === selectedValue);
    return { ...acc,
      [index]: selectedValue
    };
  }, {});
  const indicator = metricsLabel.map(metricLabel => {
    var _columnConfig$metricL;

    return {
      name: metricLabel,
      max: columnConfig == null ? void 0 : (_columnConfig$metricL = columnConfig[metricLabel]) == null ? void 0 : _columnConfig$metricL.radarMetricMaxValue
    };
  });
  const series = [{
    type: 'radar',
    animation: false,
    emphasis: {
      label: {
        show: true,
        fontWeight: 'bold',
        backgroundColor: 'white'
      }
    },
    data: transformedData
  }];
  const echartOptions = {
    grid: { ...defaultGrid
    },
    tooltip: { ...defaultTooltip,
      trigger: 'item'
    },
    legend: { ...getLegendProps(legendType, legendOrientation, showLegend),
      data: Array.from(columnsLabelMap.keys())
    },
    series,
    radar: {
      shape: isCircle ? 'circle' : 'polygon',
      indicator
    }
  };
  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    labelMap: Object.fromEntries(columnsLabelMap),
    groupby,
    selectedValues
  };
}