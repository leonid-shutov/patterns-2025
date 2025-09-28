const UserSchema = {
  id: { type: "int", primary: true },
  name: { type: "str", index: true },
  age: { type: "int" },
};

const UserService = (db) => ({
  create: (name, age) => db.add("user", { name, age }),
  getAll: () => db.getAll("user"),
  update: async () => {
    await db.transaction("user", "readwrite", async (tx) => {
      const user13 = await tx.get("user", 13);
      user13.age++;
      await tx.update("user", user13);
    });
  },
  delete: (id) => db.delete("user", id),
  getAdults: () => {
    const filter = (user) => user.age >= 18;
    return db.select("user", { filter });
  },
});

export { UserService, UserSchema };
