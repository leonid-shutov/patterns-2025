const { test } = require("node:test");
const assert = require("node:assert");
const { strategies, createStrategy } = require("./agent.module.js");

test("Strategy", () => {
  const agentStrategy = createStrategy("agent", ["notify", "multicast"]);
  agentStrategy.registerBehaviour("email", {
    notify: (to, message) => {
      console.log(`Sending "email" notification to <${to}>`);
      console.log(`message length: ${message.length}`);
    },
    multicast: (message) => {
      console.log(`Sending "email" notification to all`);
      console.log(`message length: ${message.length}`);
    },
  });

  const paymentStrategy = createStrategy("payment", ["pay"]);
  paymentStrategy.registerBehaviour("paypal", {
    pay: (amount) => console.log(`${amount} payed by Paypal`),
  });

  const buffer = [];
  console.log = (msg) => buffer.push(msg);

  const emailNotify = agentStrategy.getBehaviour("email", "notify");
  emailNotify("abc@gmail.com", "Hello");

  const paypalPay = strategies.get("payment").getBehaviour("paypal", "pay");
  paypalPay("$200");

  assert.deepStrictEqual(buffer, [
    'Sending "email" notification to <abc@gmail.com>',
    "message length: 5",
    "$200 payed by Paypal",
  ]);
});
