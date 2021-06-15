import { DatasourceType } from './types/Datasource';
export default class DatasourceKey {
  constructor(key) {
    this.id = void 0;
    this.type = void 0;
    const [idStr, typeStr] = key.split('__');
    this.id = parseInt(idStr, 10);
    this.type = typeStr === 'table' ? DatasourceType.Table : DatasourceType.Druid;
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