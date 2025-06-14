const strategies = new Map();

const createStrategy = (strategyName, actions) => {
  const implementations = new Map();

  const registerBehaviour = (implementationName, behaviour) => {
    if (typeof implementationName !== "string") {
      throw new Error("Implementation name expected to be string");
    }

    const actionsToRegister = Object.keys(behaviour);
    if (actionsToRegister.some((action) => !actions.includes(action))) {
      throw new Error("Unsupported actions");
    }

    implementations.set(implementationName, { ...behaviour });
  };

  const getBehaviour = (implementationName, actionName) => {
    const behaviour = implementations.get(implementationName);
    if (behaviour === undefined) {
      throw new Error(`Strategy "${implementationName}" is not found`);
    }
    const handler = behaviour[actionName];
    if (handler === undefined) {
      throw new Error(
        `Action "${actionName}" for strategy "${implementationName}" is not found`,
      );
    }
    return handler;
  };

  const strategy = { registerBehaviour, getBehaviour };
  strategies.set(strategyName, strategy);

  return strategy;
};

module.exports = { strategies, createStrategy };
