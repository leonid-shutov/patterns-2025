type Action = (...args: any) => any;
type Behaviour = Record<string, Action>;

type Strategy = {
  registerBehaviour(implementationName: string, behaviour: Behaviour): void;

  getBehaviour(implementationName: string, actionName: string): Action;
};

export function createStrategy(
  strategyName: string,
  actions: string[]
): Strategy;

export const strategies: Map<string, Strategy>;
