"use strict";

// Task: implement a cancelable promise by passing `timeout: number`
// as an option to the promisified function (last argument,
// replacing the callback).

const hasTimeout = (options) =>
  typeof options.timeout === "number" && options.timeout > 0;

const hasOptions = (args) => hasTimeout(args.at(-1));

const promisify =
  (fn) =>
  (...args) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    let timeout = null;

    const callback = (err, data) => {
      if (timeout !== null) clearTimeout(timeout);
      if (err !== null) reject(err);
      else resolve(data);
    };

    if (hasOptions(args)) {
      const options = args.pop();
      if (hasTimeout(options)) {
        timeout = setTimeout(reject, options.timeout, new Error("Timeout"));
      }
    }

    fn(...args, callback);

    return promise;
  };

// Usage

const fs = require("node:fs");
const read = promisify(fs.readFile);

const main = async () => {
  const fileName = "adapter/1-promisify-solution.js";
  const data = await read(fileName, "utf8", { timeout: 1 });
  console.log(`File "${fileName}" size: ${data.length}`);
};

main();
