import { Database } from "./database.js";
import { Logger } from "./logger.js";

const logger = new Logger("output");

(async () => {
  const db = await Database.open("Example", 1, ["user"]);

  document.getElementById("add").onclick = async () => {
    const name = prompt("Enter user name:");
    if (!name) return;
    const age = parseInt(prompt("Enter age:"), 10);
    if (!Number.isInteger(age)) return;
    try {
      const userAdded = await db.add("user", { name, age });
      logger.log("Added:", userAdded);
    } catch (error) {
      console.log({ error });
      logger.log("Add failed");
    }
  };

  document.getElementById("get").onclick = async () => {
    try {
      const users = await db.getAll("user");
      logger.log("Users:", users);
    } catch (error) {
      console.log({ error });
      logger.log("Get failed");
    }
  };

  document.getElementById("update").onclick = async () => {
    await db.transaction("user", "readwrite", async (tx) => {
      const user13 = await tx.get("user", 13);
      user13.age++;
      await tx.update("user", user13);
    });
  };

  document.getElementById("delete").onclick = async () => {
    await db.delete(2);
  };

  document.getElementById("adults").onclick = async () => {
    const adults = [];
    for await (const user of db.cursor("user")) {
      if (user.age > 18) adults.push(user);
    }
    logger.log(adults);
  };
})();
