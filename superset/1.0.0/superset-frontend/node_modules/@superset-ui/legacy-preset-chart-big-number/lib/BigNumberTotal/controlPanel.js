"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@superset-ui/core");

var _chartControls = require("@superset-ui/chart-controls");

var _sharedControls = require("../sharedControls");

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
var _default = {
  controlPanelSections: [_chartControls.sections.legacyRegularTime, {
    label: (0, _core.t)('Query'),
    expanded: true,
    controlSetRows: [['metric'], ['adhoc_filters']]
  }, {
    label: (0, _core.t)('Options'),
    expanded: true,
    controlSetRows: [[{
      name: 'subheader',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Subheader'),
        description: (0, _core.t)('Description text that shows up below your Big Number')
      }
    }], ['y_axis_format']]
  }, {
    label: (0, _core.t)('Chart Options'),
    expanded: true,
    controlSetRows: [[_sharedControls.headerFontSize], [_sharedControls.subheaderFontSize]]
  }],
  controlOverrides: {
    y_axis_format: {
      label: (0, _core.t)('Number format')
    }
  }
};
exports.default = _default;