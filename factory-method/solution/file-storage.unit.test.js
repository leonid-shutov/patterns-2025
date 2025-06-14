"use strict";

const { test } = require("node:test");
const assert = require("node:assert");
const { Readable } = require("node:stream");
const { FileStorage } = require("./file-storage.js");

test("FileStorage", async () => {
  const mockedLines = [
    `{ "name": "foo" }\n`,
    `{ "name": "bar" }\n`,
    `{ "name": "foo" }\n`,
  ];
  const mockedFileStream = Readable.from(mockedLines);
  const fileStorage = new FileStorage("");
  fileStorage.fileStream = mockedFileStream;
  const query = { name: "bar" };
  const buffer = [];
  for await (const chunk of fileStorage.select(query)) buffer.push(chunk);
  assert.deepStrictEqual(buffer, [{ name: "bar" }]);
});
