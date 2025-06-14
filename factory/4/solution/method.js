"use strict";

class Product {
  constructor(value) {
    this.field = value;
  }
}

class Creator {
  constructor(...configuration) {
    this.configuration = configuration;
  }

  factoryMethod(...args) {
    return new Product(...this.configuration, ...args);
  }
}
