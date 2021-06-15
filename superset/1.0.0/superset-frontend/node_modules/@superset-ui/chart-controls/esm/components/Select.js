import { css as _css } from "@emotion/react";
import _pt from "prop-types";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
import React, { useState } from 'react';
import AntdSelect from 'antd/lib/select';
import { jsx as ___EmotionJSX } from "@emotion/react";
export const {
  Option
} = AntdSelect;

/**
 * AntD select with creatable options.
 */
export default function Select({
  creatable,
  onSearch,
  dropdownMatchSelectWidth = false,
  minWidth = '100%',
  showSearch: showSearch_ = true,
  onChange,
  options,
  children,
  value,
  ...props
}) {
  const [searchValue, setSearchValue] = useState(); // force show search if creatable

  const showSearch = showSearch_ || creatable;
  const handleSearch = showSearch ? input => {
    if (creatable) {
      setSearchValue(input);
    }

    if (onSearch) {
      onSearch(input);
    }
  } : undefined;
  const optionsHasSearchValue = options == null ? void 0 : options.some(([val]) => val === searchValue);
  const optionsHasValue = options == null ? void 0 : options.some(([val]) => val === value);
  const handleChange = showSearch ? (val, opt) => {
    // reset input value once selected
    setSearchValue('');

    if (onChange) {
      onChange(val, opt);
    }
  } : onChange;
  return ___EmotionJSX(AntdSelect, _extends({
    dropdownMatchSelectWidth: dropdownMatchSelectWidth,
    showSearch: showSearch,
    onSearch: handleSearch,
    onChange: handleChange,
    value: value
  }, props, {
    css: /*#__PURE__*/_css({
      minWidth
    }, process.env.NODE_ENV === "production" ? "" : ";label:Select;", process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1NlbGVjdC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBaUZNIiwiZmlsZSI6Ii4uLy4uL3NyYy9jb21wb25lbnRzL1NlbGVjdC50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuICogZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbiAqIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbiAqIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbiAqIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuICogd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuICogc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbiAqIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4gKiBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbiAqIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBbnRkU2VsZWN0LCB7IFNlbGVjdFByb3BzIGFzIEFudGRTZWxlY3RQcm9wcyB9IGZyb20gJ2FudGQvbGliL3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCB7IE9wdGlvbiB9ID0gQW50ZFNlbGVjdDtcblxuZXhwb3J0IHR5cGUgU2VsZWN0T3B0aW9uPFZUID0gc3RyaW5nPiA9IFtWVCwgUmVhY3ROb2RlXTtcblxuZXhwb3J0IHR5cGUgU2VsZWN0UHJvcHM8VlQ+ID0gT21pdDxBbnRkU2VsZWN0UHJvcHM8VlQ+LCAnb3B0aW9ucyc+ICYge1xuICBjcmVhdGFibGU/OiBib29sZWFuO1xuICBtaW5XaWR0aD86IHN0cmluZyB8IG51bWJlcjtcbiAgb3B0aW9ucz86IFNlbGVjdE9wdGlvbjxWVD5bXTtcbn07XG5cbi8qKlxuICogQW50RCBzZWxlY3Qgd2l0aCBjcmVhdGFibGUgb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2VsZWN0PFZUIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyPih7XG4gIGNyZWF0YWJsZSxcbiAgb25TZWFyY2gsXG4gIGRyb3Bkb3duTWF0Y2hTZWxlY3RXaWR0aCA9IGZhbHNlLFxuICBtaW5XaWR0aCA9ICcxMDAlJyxcbiAgc2hvd1NlYXJjaDogc2hvd1NlYXJjaF8gPSB0cnVlLFxuICBvbkNoYW5nZSxcbiAgb3B0aW9ucyxcbiAgY2hpbGRyZW4sXG4gIHZhbHVlLFxuICAuLi5wcm9wc1xufTogU2VsZWN0UHJvcHM8VlQ+KSB7XG4gIGNvbnN0IFtzZWFyY2hWYWx1ZSwgc2V0U2VhcmNoVmFsdWVdID0gdXNlU3RhdGU8c3RyaW5nPigpO1xuICAvLyBmb3JjZSBzaG93IHNlYXJjaCBpZiBjcmVhdGFibGVcbiAgY29uc3Qgc2hvd1NlYXJjaCA9IHNob3dTZWFyY2hfIHx8IGNyZWF0YWJsZTtcbiAgY29uc3QgaGFuZGxlU2VhcmNoID0gc2hvd1NlYXJjaFxuICAgID8gKGlucHV0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGNyZWF0YWJsZSkge1xuICAgICAgICAgIHNldFNlYXJjaFZhbHVlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob25TZWFyY2gpIHtcbiAgICAgICAgICBvblNlYXJjaChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA6IHVuZGVmaW5lZDtcblxuICBjb25zdCBvcHRpb25zSGFzU2VhcmNoVmFsdWUgPSBvcHRpb25zPy5zb21lKChbdmFsXSkgPT4gdmFsID09PSBzZWFyY2hWYWx1ZSk7XG4gIGNvbnN0IG9wdGlvbnNIYXNWYWx1ZSA9IG9wdGlvbnM/LnNvbWUoKFt2YWxdKSA9PiB2YWwgPT09IHZhbHVlKTtcblxuICBjb25zdCBoYW5kbGVDaGFuZ2U6IFNlbGVjdFByb3BzPFZUPlsnb25DaGFuZ2UnXSA9IHNob3dTZWFyY2hcbiAgICA/ICh2YWwsIG9wdCkgPT4ge1xuICAgICAgICAvLyByZXNldCBpbnB1dCB2YWx1ZSBvbmNlIHNlbGVjdGVkXG4gICAgICAgIHNldFNlYXJjaFZhbHVlKCcnKTtcbiAgICAgICAgaWYgKG9uQ2hhbmdlKSB7XG4gICAgICAgICAgb25DaGFuZ2UodmFsLCBvcHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgOiBvbkNoYW5nZTtcblxuICByZXR1cm4gKFxuICAgIDxBbnRkU2VsZWN0PFZUPlxuICAgICAgZHJvcGRvd25NYXRjaFNlbGVjdFdpZHRoPXtkcm9wZG93bk1hdGNoU2VsZWN0V2lkdGh9XG4gICAgICBzaG93U2VhcmNoPXtzaG93U2VhcmNofVxuICAgICAgb25TZWFyY2g9e2hhbmRsZVNlYXJjaH1cbiAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICBjc3M9e3tcbiAgICAgICAgbWluV2lkdGgsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtvcHRpb25zPy5tYXAoKFt2YWwsIGxhYmVsXSkgPT4gKFxuICAgICAgICA8T3B0aW9uIHZhbHVlPXt2YWx9PntsYWJlbH08L09wdGlvbj5cbiAgICAgICkpfVxuICAgICAge2NoaWxkcmVufVxuICAgICAge3ZhbHVlICYmICFvcHRpb25zSGFzVmFsdWUgJiYgKFxuICAgICAgICA8T3B0aW9uIGtleT17dmFsdWV9IHZhbHVlPXt2YWx1ZX0+XG4gICAgICAgICAge3ZhbHVlfVxuICAgICAgICA8L09wdGlvbj5cbiAgICAgICl9XG4gICAgICB7c2VhcmNoVmFsdWUgJiYgIW9wdGlvbnNIYXNTZWFyY2hWYWx1ZSAmJiAoXG4gICAgICAgIDxPcHRpb24ga2V5PXtzZWFyY2hWYWx1ZX0gdmFsdWU9e3NlYXJjaFZhbHVlfT5cbiAgICAgICAgICB7LyogVW5mb3J0dW5hdGVseSBBbnREIHNlbGVjdCBkb2VzIG5vdCBzdXBwb3J0IGRpc3BsYXlpbmcgZGlmZmVyZW50XG4gICAgICAgICAgbGFiZWwgZm9yIG9wdGlvbiB2cyBzZWxlY3QgdmFsdWUsIHNvIHdlIGNhbid0IHVzZVxuICAgICAgICAgIGB0KCdDcmVhdGUgXCIlc1wiJywgc2VhcmNoVmFsdWUpYCBoZXJlICovfVxuICAgICAgICAgIHtzZWFyY2hWYWx1ZX1cbiAgICAgICAgPC9PcHRpb24+XG4gICAgICApfVxuICAgIDwvQW50ZFNlbGVjdD5cbiAgKTtcbn1cblxuU2VsZWN0Lk9wdGlvbiA9IE9wdGlvbjtcbiJdfQ== */")
  }), options == null ? void 0 : options.map(([val, label]) => ___EmotionJSX(Option, {
    value: val
  }, label)), children, value && !optionsHasValue && ___EmotionJSX(Option, {
    key: value,
    value: value
  }, value), searchValue && !optionsHasSearchValue && ___EmotionJSX(Option, {
    key: searchValue,
    value: searchValue
  }, searchValue));
}
Select.propTypes = {
  creatable: _pt.bool,
  minWidth: _pt.oneOfType([_pt.string, _pt.number]),
  options: _pt.array
};
Select.Option = Option;