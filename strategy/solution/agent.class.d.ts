type Action = (...args: any) => any;
type Behaviour = Record<string, Action>;

export class Strategy {
  constructor(strategyName: string, actions: string[]);

  registerBehaviour(implementationName: string, behaviour: Behaviour): void;
  getBehaviour(implementationName: string, actionName: string): Behaviour;
}
