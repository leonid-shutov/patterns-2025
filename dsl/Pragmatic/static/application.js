import { Database } from "./database.js";
import { Logger } from "./logger.js";
import { UserSchema, UserService } from "./user.js";

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
  const db = await Database.open("Example", 1, schemas);
  const userService = UserService(db);
  const features = Features(userService);

  for (const [name, handler] of Object.entries(features)) {
    document.getElementById(name).onclick = handler;
  }
})();
