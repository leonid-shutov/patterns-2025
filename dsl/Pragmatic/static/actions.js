const actions = {
  add: {
    mode: "readwrite",
    action:
      ({ store, validate }) =>
      (record) => {
        validate(record);
        return store.add(record);
      },
  },
  update: {
    mode: "readwrite",
    action:
      ({ store, validate }) =>
      (record) => {
        validate(record);
        return store.put(record);
      },
  },
  delete: {
    mode: "readwrite",
    action:
      ({ store }) =>
      (id) =>
        store.delete(id),
  },
  get: {
    mode: "readonly",
    action:
      ({ store }) =>
      (id) =>
        store.get(id),
  },
  getAll: {
    mode: "readonly",
    action:
      ({ store }) =>
      () =>
        store.getAll(),
  },
  select: {
    mode: "readonly",
    action:
      ({ store }) =>
      ({ where, limit, offset, order, filter, sort }) =>
        new Promise((resolve, reject) => {
          const result = [];
          let skipped = 0;

          const reply = () => {
            if (sort) result.sort(sort);
            if (order) {
              const [field, dir = "asc"] = Object.entries(order)[0] ?? [];
              if (field) {
                const sign = dir === "desc" ? -1 : 1;
                result.sort((a, b) => {
                  const x = a[field];
                  const y = b[field];
                  if (x === y) return 0;
                  return x > y ? sign : -sign;
                });
              }
            }
            resolve(result);
          };

          const req = store.openCursor();
          req.onerror = () => reject(req.error);
          req.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) return void reply();
            const record = cursor.value;

            const matchesWhere =
              !where ||
              Object.entries(where).every(([key, val]) => record[key] === val);
            const matchesFilter = !filter || filter(record);

            if (matchesWhere && matchesFilter) {
              if (!offset || skipped >= offset) {
                result.push(record);
              } else {
                skipped++;
              }
              if (limit && result.length >= limit) {
                return void reply();
              }
            }

            cursor.continue();
          };
        }),
  },
};

export { actions };
