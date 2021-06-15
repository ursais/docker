export default class LazyFactory {
  constructor(factoryFn) {
    this.activeNodes = new Map();
    this.factoryFn = void 0;
    this.factoryFn = factoryFn;
  }

  createInContainer(container = document.body) {
    if (this.activeNodes.has(container)) {
      const entry = this.activeNodes.get(container);
      entry.counter += 1;
      return entry.node;
    }

    const node = this.factoryFn();
    container.append(node);
    this.activeNodes.set(container, {
      counter: 1,
      node
    });
    return node;
  }

  removeFromContainer(container = document.body) {
    if (this.activeNodes.has(container)) {
      const entry = this.activeNodes.get(container);
      entry.counter -= 1;

      if (entry.counter === 0) {
        container.removeChild(entry.node);
        this.activeNodes.delete(container);
      }
    }
  }

}