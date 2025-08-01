const actions = {
  add: {
    mode: "readwrite",
    action: (store) => (record) => store.add(record),
  },
  update: {
    mode: "readwrite",
    action: (store) => (record) => store.put(record),
  },
  delete: {
    mode: "readwrite",
    action: (store) => (id) => store.delete(id),
  },
  get: {
    mode: "readonly",
    action: (store) => (id) => store.get(id),
  },
  getAll: {
    mode: "readonly",
    action: (store) => () => store.getAll(),
  },
};

export { actions };
