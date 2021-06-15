"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENTS = exports.COORDINATE_SYSTEM = void 0;
var COORDINATE_SYSTEM = {
  LNGLAT: 1,
  LNGLAT_DEPRECATED: 5,
  METER_OFFSETS: 2,
  METERS: 2,
  LNGLAT_OFFSETS: 3,
  IDENTITY: 0
};
exports.COORDINATE_SYSTEM = COORDINATE_SYSTEM;
var EVENTS = {
  click: {
    handler: 'onClick'
  },
  panstart: {
    handler: 'onDragStart'
  },
  panmove: {
    handler: 'onDrag'
  },
  panend: {
    handler: 'onDragEnd'
  }
};
exports.EVENTS = EVENTS;
//# sourceMappingURL=constants.js.map