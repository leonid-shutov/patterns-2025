"use strict";

// Task: implement cancellation by passing `AbortSignal` as an option
// to the promisified function (last argument, replacing the callback).
// Hint: Create `AbortController` or `AbortSignal` in the usage section.

const hasSignal = (options) => options.signal instanceof AbortSignal;

const hasOptions = (args) => hasSignal(args.at(-1));

const promisify =
  (fn) =>
  (...args) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    const callback = (err, data) => {
      if (err !== null) reject(err);
      else resolve(data);
    };

    if (hasOptions(args)) {
      const options = args.pop();
      if (hasSignal(options)) {
        options.signal.addEventListener("abort", reject, { once: true });
      }
    }

    fn(...args, callback);

    return promise;
  };

// Usage

const fs = require("node:fs");
const read = promisify(fs.readFile);

const main = async () => {
  const fileName = "adapter/1-promisify-problem.js";
  const ac = new AbortController();
  setTimeout(ac.abort.bind(ac), 1);
  try {
    const data = await read(fileName, "utf8", { signal: ac.signal });
    console.log(`File "${fileName}" size: ${data.length}`);
  } catch (error) {
    console.error(error);
  }
};

main();
