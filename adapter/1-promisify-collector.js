"use strict";
const { collect } = require("metautil");

// Task: implement a cancelable promise by passing `timeout: number`
// as an option to the promisified function (last argument,
// replacing the callback).

const hasTimeout = (options) =>
  typeof options.timeout === "number" && options.timeout > 0;

const hasOptions = (args) => hasTimeout(args.at(-1));

const KEY = "key";

const promisify =
  (fn) =>
  (...args) => {
    let timeout = 0;
    if (hasOptions(args)) {
      const options = args.pop();
      if (hasTimeout(options)) timeout = options.timeout;
    }
    const ac = collect([KEY], { timeout });
    ac.take(KEY, fn, ...args);
    return ac.then((x) => x[KEY]);
  };

// Usage

const fs = require("node:fs");
const read = promisify(fs.readFile);

const main = async () => {
  const fileName = "adapter/1-promisify-node.js";
  const data = await read(fileName, "utf8", { timeout: 1 });
  console.log(`File "${fileName}" size: ${data.length}`);
};

main();
