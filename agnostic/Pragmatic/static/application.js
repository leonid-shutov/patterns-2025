import { adaptOPFS } from "./adapter.js";
import { Storage } from "./storage.js";
import { Database } from "./dsl/database.js";
import { UserSchema, UserService } from "./dsl/user.js";
import { Logger } from "./logger.js";
import { FileSystem } from "./opfs/file-system.js";

const logger = new Logger("output");

const Features = (userService) => ({
  add: async () => {
    const name = prompt("Enter user name:");
    if (!name) return;
    const age = parseInt(prompt("Enter age:"), 10);
    const userAdded = await userService.create(name, age);
    logger.log("Added:", userAdded);
  },
  get: async () => {
    const users = await userService.getAll();
    logger.log("Users:", users);
  },
  update: () => userService.update(),
  delete: () => userService.delete(2),
  adults: async () => {
    const adults = await userService.getAdults();
    logger.log("Adults:", adults);
  },
});

(async () => {
  const schemas = { user: UserSchema };
  const indexedDb = await Database.open("Example", 1, schemas);
  const fileSystem = await FileSystem.create();
  const adaptedFyleSystem = adaptOPFS(fileSystem);

  const storage = Storage(adaptedFyleSystem);

  const userService = UserService(storage);
  const features = Features(userService);

  for (const [name, handler] of Object.entries(features)) {
    document.getElementById(name).onclick = handler;
  }
})();
