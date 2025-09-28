export interface Storage<T> {
  add(record: T): Promise<void>;
  getAll(): Promise<T[]>;
}
