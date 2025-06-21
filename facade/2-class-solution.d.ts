export class TimeoutCollection<K, V> implements Map<K, V> {
  constructor(timeout: number);

  set(key: K, value: V): this;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;
  forEach(
    callback: (value: V, key: K, map: Map<K, V>) => void,
    thisArg: any,
  ): void;
  toArray(): [K, V][];
  readonly size: number;
  [Symbol.iterator](): IterableIterator<[K, V]>;
  [Symbol.toStringTag]: string;
}
