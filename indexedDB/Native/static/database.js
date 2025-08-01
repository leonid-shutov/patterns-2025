import { actions } from "./actions.js";

const executor =
  ({ mode, action }, options) =>
  (storeName, ...args) => {
    const { promise, resolve, reject } = Promise.withResolvers();

    // take use global transaction if provided, otherwise create a new one
    const tx = options.tx ?? options.db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = action(store)(...args);

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

const runTransaction = async (db, storeName, mode, callback) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const tx = db.transaction(storeName, mode);
  const api = buildApi({ tx });

  const result = await callback(api);

  tx.oncomplete = () => resolve(result);
  tx.onerror = reject;

  return promise;
};

const openIndexedDB = (name, version, stores) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = () => {
      const db = request.result;
      for (const storeName of stores) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
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
  open: async (name, version, stores) => {
    const db = await openIndexedDB(name, version, stores);
    const api = buildApi({ db });
    const transaction = runTransaction.bind(undefined, db);
    const cursor = openCursor.bind(undefined, db);

    return {
      transaction,
      cursor,
      ...api,
    };
  },
};

export { Database };
