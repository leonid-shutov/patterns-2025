import { actions } from "./actions.js";

const validator = (schema) => (record) => {
  for (const [key, val] of Object.entries(record)) {
    const field = schema[key];
    if (!field) throw new Error(`${key} is not defined`);
    if (field.type === "int") {
      if (Number.isInteger(val)) continue;
      throw new Error(`${key} expected to be integer`);
    } else if (field.type === "str") {
      if (typeof val === "string") continue;
      throw new Error(`${key} expected to be string`);
    }
  }
};

const executor =
  ({ mode, action }, options) =>
  (storeName, ...args) => {
    const { promise, resolve, reject } = Promise.withResolvers();

    // take use global transaction if provided, otherwise create a new one
    const tx = options.tx ?? options.db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const schema = options.schemas[storeName];
    const validate = validator(schema);
    const req = action({ store, validate })(...args);

    if (req instanceof Promise) {
      req.then(resolve).catch(reject);
      return promise;
    }

    // if global transaction is provided resolve as soon as request is ready,
    // otherwise wait for local transaction to complete
    if (options.tx !== undefined) {
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    } else {
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = reject;
    }

    return promise;
  };

const buildApi = (options) => {
  const entries = Object.entries(actions).map(([name, actionDefinition]) => [
    name,
    executor(actionDefinition, options),
  ]);
  return Object.fromEntries(entries);
};

const runTransaction = async ({ db, schemas }, storeName, mode, fn) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const tx = db.transaction(storeName, mode);
  const api = buildApi({ tx, schemas });

  const result = await fn(api);

  tx.oncomplete = () => resolve(result);
  tx.onerror = reject;

  return promise;
};

const openIndexedDB = (name, version, schemas) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const [name, schema] of Object.entries(schemas)) {
        if (!db.objectStoreNames.contains(name)) {
          const options = { keyPath: "id", autoIncrement: true };
          const store = db.createObjectStore(name, options);
          for (const [field, def] of Object.entries(schema)) {
            if (name !== "id" && def.index) {
              store.createIndex(field, field, { unique: false });
            }
          }
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const nextCursor = (req) =>
  new Promise((resolve, reject) => {
    req.onsuccess = (event) => resolve(event.target.result);
    req.onerror = (event) => reject(event.target.error);
  });

async function* openCursor(db, storeName) {
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  const req = store.openCursor();

  let cursor = await nextCursor(req);
  while (cursor) {
    yield cursor.value;
    cursor.continue();
    cursor = await nextCursor(req);
  }
}

const Database = {
  open: async (name, version, schemas) => {
    const db = await openIndexedDB(name, version, schemas);
    const api = buildApi({ db, schemas });
    const transaction = runTransaction.bind(undefined, { db, schemas });
    const cursor = openCursor.bind(undefined, db);

    return {
      transaction,
      cursor,
      ...api,
    };
  },
};

export { Database };
