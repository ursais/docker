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
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
export let EchartsTimeseriesContributionType;

(function (EchartsTimeseriesContributionType) {
  EchartsTimeseriesContributionType["Row"] = "row";
  EchartsTimeseriesContributionType["Column"] = "column";
})(EchartsTimeseriesContributionType || (EchartsTimeseriesContributionType = {}));

export let EchartsTimeseriesSeriesType;

(function (EchartsTimeseriesSeriesType) {
  EchartsTimeseriesSeriesType["Line"] = "line";
  EchartsTimeseriesSeriesType["Scatter"] = "scatter";
  EchartsTimeseriesSeriesType["Smooth"] = "smooth";
  EchartsTimeseriesSeriesType["Bar"] = "bar";
  EchartsTimeseriesSeriesType["Start"] = "start";
  EchartsTimeseriesSeriesType["Middle"] = "middle";
  EchartsTimeseriesSeriesType["End"] = "end";
})(EchartsTimeseriesSeriesType || (EchartsTimeseriesSeriesType = {}));

export const DEFAULT_FORM_DATA = { ...DEFAULT_LEGEND_FORM_DATA,
  annotationLayers: [],
  area: false,
  forecastEnabled: false,
  forecastInterval: 0.8,
  forecastPeriods: 10,
  forecastSeasonalityDaily: null,
  forecastSeasonalityWeekly: null,
  forecastSeasonalityYearly: null,
  logAxis: false,
  markerEnabled: false,
  markerSize: 6,
  minorSplitLine: false,
  opacity: 0.2,
  orderDesc: true,
  rowLimit: 10000,
  seriesType: EchartsTimeseriesSeriesType.Line,
  stack: false,
  tooltipTimeFormat: 'smart_date',
  truncateYAxis: true,
  yAxisBounds: [null, null],
  xAxisShowMinLabel: false,
  xAxisShowMaxLabel: false,
  zoomable: false,
  richTooltip: true,
  xAxisLabelRotation: 0,
  yAxisTitle: ''
};