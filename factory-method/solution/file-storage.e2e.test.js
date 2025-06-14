const { test } = require("node:test");
const assert = require("node:assert");

const { FileStorage } = require("./file-storage.js");

test("FileStorage", async () => {
  const fileStorage = new FileStorage("factory-method/solution/storage.dat");
  const query = { city: "Roma" };
  const buffer = [];
  for await (const chunk of fileStorage.select(query)) buffer.push(chunk);
  assert.deepStrictEqual(buffer, [
    { city: "Roma", name: "Marcus Aurelius" },
    { city: "Roma", name: "Lucius Verus" },
  ]);
});
