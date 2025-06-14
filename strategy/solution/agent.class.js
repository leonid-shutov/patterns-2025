class Strategy {
  constructor(strategyName, actions) {
    this.strategyName = strategyName;
    this.actions = actions;
    this.implementations = new Map();
  }

  registerBehaviour(implementationName, behaviour) {
    if (typeof implementationName !== "string") {
      throw new Error("Implementation name expected to be string");
    }

    const actionsToRegister = Object.keys(behaviour);
    if (actionsToRegister.some((action) => !this.actions.includes(action))) {
      throw new Error("Unsupported actions");
    }

    this.implementations.set(implementationName, { ...behaviour });
  }

  getBehaviour(implementationName, actionName) {
    const behaviour = this.implementations.get(implementationName);
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
  }
}

module.exports = { Strategy };
