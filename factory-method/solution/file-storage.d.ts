import { Readable } from "node:stream";

type Query = Record<string, number | boolean | string | null>;

export class FileLineCursor<T, Q extends Partial<T>> {
  constructor(fileStorage: FileStorage<T>, query: Q);

  [Symbol.asyncIterator](): AsyncIterator<T>;
}

export class FileStorage<T> {
  constructor(fileName: string);

  fileStream: Readable;
  select<Q extends Partial<T>>(query: Q): FileLineCursor<T, Q>;
}
