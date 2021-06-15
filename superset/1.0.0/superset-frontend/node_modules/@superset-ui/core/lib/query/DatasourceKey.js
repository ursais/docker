"use strict";

exports.__esModule = true;
exports.default = void 0;

var _Datasource = require("./types/Datasource");

class DatasourceKey {
  constructor(key) {
    this.id = void 0;
    this.type = void 0;
    const [idStr, typeStr] = key.split('__');
    this.id = parseInt(idStr, 10);
    this.type = typeStr === 'table' ? _Datasource.DatasourceType.Table : _Datasource.DatasourceType.Druid;
  }

  toString() {
    return `${this.id}__${this.type}`;
  }

  toObject() {
    return {
      id: this.id,
      type: this.type
    };
  }

}

exports.default = DatasourceKey;