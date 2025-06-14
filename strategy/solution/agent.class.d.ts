type Action = (...args: any) => any;
type Behaviour<A extends string> = Record<string, A>;

export class Strategy<A extends string> {
  constructor(strategyName: string, actions: A[]);

  registerBehaviour(implementationName: string, behaviour: Behaviour<A>): void;
  getBehaviour(implementationName: string, actionName: A): Behaviour<A>;
}
