/** @typedef {import('./storage.d.ts').Storage} Storage */

/** @returns {Storage} */
const adaptOPFS = (fileSystem) => ({
  add: (name, record) => fileSystem.write(name + ".json", record),
  getAll: (name) => fileSystem.read(name + ".json"),
});

export { adaptOPFS };
