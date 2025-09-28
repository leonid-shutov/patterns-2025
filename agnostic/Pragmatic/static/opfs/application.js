"use strict";

import { FileSystem } from "./file-system";

const data = [
  { name: "Marcus", age: 20 },
  { name: "Lucius", age: 30 },
  { name: "Antoninus", age: 40 },
];

const fileSystem = await FileSystem.create();

document.getElementById("create").onclick = async () => {
  await fileSystem.write("data.json", data);
};

document.getElementById("read").onclick = async () => {
  const data = await fileSystem.read("data.json");
};
