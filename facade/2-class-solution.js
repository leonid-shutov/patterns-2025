'use strict';

/** @typedef {import('./2-class-solution.d.ts').TimeoutCollection} ITimeoutCollection */

/** @implements ITimeoutCollection */
class TimeoutCollection {
  constructor(timeout) {
    this.timeout = timeout;
    this.collection = new Map();
    this.timers = new Map();
  }

  set(key, value) {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    const timeout = setTimeout(() => {
      this.delete(key);
    }, this.timeout);
    timeout.unref();
    this.timers.set(key, timeout);
    this.collection.set(key, value);
    return this;
  }

  get(key) {
    return this.collection.get(key);
  }

  has(key) {
    return this.collection.has(key);
  }

  delete(key) {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
      return this.collection.delete(key);
    }
    return false;
  }

  clear() {
    for (const key of this.collection.keys()) this.delete(key);
  }

  keys() {
    return this.collection.keys();
  }

  values() {
    return this.collection.values();
  }

  entries() {
    return this.collection.entries();
  }

  forEach(callback, thisArg) {
    return this.collection.forEach(callback, thisArg);
  }

  toArray() {
    return [...this.collection.entries()];
  }

  get size() {
    return this.collection.size;
  }

  [Symbol.iterator]() {
    return this.collection[Symbol.iterator]();
  }

  get [Symbol.toStringTag]() {
    return this.collection[Symbol.toStringTag];
  }
}

// Usage

const hash = new TimeoutCollection(1000);
hash.set('uno', 1);
console.dir({ array: hash.toArray() });

hash.set('due', 2);
console.dir({ array: hash.toArray() });

setTimeout(() => {
  hash.set('tre', 3);
  console.dir({ array: hash.toArray() });

  setTimeout(() => {
    hash.set('quattro', 4);
    console.dir({ array: hash.toArray() });
  }, 500);
}, 1500);

module.exports = { TimeoutCollection };
