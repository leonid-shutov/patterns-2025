"use strict";

// Task: ensure all blocks of code in the usage section iterate in parallel.
// Currently, only the last block (of 3) works. Fix this issue so that
// all blocks can iterate concurrently using a single `Timer` instance.

const { EventEmitter } = require("node:events");

class Timer {
  #eventName = "step";

  constructor(delay) {
    this.ee = new EventEmitter();
    let counter = 0;
    setInterval(() => this.ee.emit(this.#eventName, ++counter), delay);
  }

  [Symbol.asyncIterator]() {
    const next = () =>
      new Promise((resolve) => {
        const listener = (step) => resolve({ value: step, done: false });
        this.ee.once(this.#eventName, listener);
      });

    return { next };
  }
}

// Usage

const main = async () => {
  const timer = new Timer(1000);

  (async () => {
    console.log("Section 1 start");
    for await (const step of timer) {
      console.log({ section: 1, step });
    }
  })();

  (async () => {
    console.log("Section 2 start");
    const iter = timer[Symbol.asyncIterator]();
    do {
      const { value, done } = await iter.next();
      console.log({ section: 2, step: value, done });
    } while (true);
  })();

  (async () => {
    console.log("Section 3 start");
    const iter = timer[Symbol.asyncIterator]();
    do {
      const { value, done } = await iter.next();
      console.log({ section: 3, step: value, done });
    } while (true);
  })();
};

main();

module.exports = { Timer };
