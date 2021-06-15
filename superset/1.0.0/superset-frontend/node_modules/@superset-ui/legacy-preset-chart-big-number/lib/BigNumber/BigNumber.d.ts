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
import React from 'react';
import { NumberFormatter, TimeFormatter } from '@superset-ui/core';
declare type TimeSeriesDatum = {
    x: number;
    y: number | null;
};
export declare function renderTooltipFactory(formatDate?: TimeFormatter, formatValue?: NumberFormatter): ({ datum: { x, y } }: {
    datum: TimeSeriesDatum;
}) => JSX.Element;
declare type BigNumberVisProps = {
    className?: string;
    width: number;
    height: number;
    bigNumber?: number | null;
    bigNumberFallback?: TimeSeriesDatum;
    formatNumber: NumberFormatter;
    formatTime: TimeFormatter;
    fromDatetime?: number;
    toDatetime?: number;
    headerFontSize: number;
    subheader: string;
    subheaderFontSize: number;
    showTrendLine?: boolean;
    startYAxisAtZero?: boolean;
    timeRangeFixed?: boolean;
    trendLineData?: TimeSeriesDatum[];
    mainColor: string;
};
declare class BigNumberVis extends React.PureComponent<BigNumberVisProps, {}> {
    private gradientId;
    static defaultProps: {
        className: string;
        formatNumber: NumberFormatter;
        formatTime: TimeFormatter;
        headerFontSize: number;
        mainColor: string;
        showTrendLine: boolean;
        startYAxisAtZero: boolean;
        subheader: string;
        subheaderFontSize: number;
        timeRangeFixed: boolean;
    };
    getClassName(): string;
    createTemporaryContainer(): HTMLDivElement;
    renderFallbackWarning(): JSX.Element | null;
    renderHeader(maxHeight: number): JSX.Element;
    renderSubheader(maxHeight: number): JSX.Element | null;
    renderTrendline(maxHeight: number): JSX.Element | null;
    render(): JSX.Element;
}
declare const _default;
export default _default;
//# sourceMappingURL=BigNumber.d.ts.map