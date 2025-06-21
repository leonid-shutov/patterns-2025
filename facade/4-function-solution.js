'use strict';

const timeoutCollection = (interval) => {
  const collection = new Map();
  const expiration = new Map();

  const isExpired = (key) => Date.now() > expiration.get(key);

  const set = (key, value) => {
    const expirationTime = Date.now() + interval;
    collection.set(key, value);
    expiration.set(key, expirationTime);
  };

  const deleteKey = (key) => {
    collection.delete(key);
    expiration.delete(key);
  };

  const get = (key) => {
    if (isExpired(key)) {
      deleteKey(key);
      return undefined;
    }
    return collection.get(key);
  };

  const toArray = () => {
    const array = [];
    for (const entry of collection.entries()) {
      const key = entry[0];
      if (isExpired(key)) deleteKey(key);
      else array.push(entry);
    }
    return array;
  };

  return { get, set, delete: deleteKey, toArray };
};

// Usage

const hash = timeoutCollection(1000);
hash.set('uno', 1);
console.dir({ array: hash.toArray() });

hash.set('due', 2);
console.dir({ array: hash.toArray() });

setTimeout(() => {
  hash.set('tre', 3);
  console.dir({ array: hash.toArray() });

  setTimeout(() => {
    hash.set('quattro', 4);
    console.dir({ array: hash.toArray() });
  }, 500);
}, 1500);

module.exports = { timeoutCollection };
