/** @typedef {import('./storage.d.ts').Storage} Storage */

/** @type {(db: Storage) => Storage} */
const Storage = (db) => ({
  add: db.add,
  getAll: db.getAll,
});

export { Storage };
