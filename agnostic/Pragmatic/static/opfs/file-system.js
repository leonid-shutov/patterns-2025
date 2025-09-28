"use static";

import {
  UnsupportedFileExtensionError,
  FileNotFoundError,
  AuthorizationError,
  UnexpectedError,
} from "./errors.js";

class FileSystem {
  #fs;

  #serializers = {
    json: JSON,
  };

  constructor(fs) {
    this.#fs = fs;
  }

  static async create() {
    const fs = await navigator.storage.getDirectory();
    return new this(fs);
  }

  #getSerializer(fileName) {
    const extension = fileName.split(".").pop();
    const serializer = this.#serializers[extension] ?? null;
    if (serializer === null) {
      throw new UnsupportedFileExtensionError({ meta: { fileName } });
    }
    return serializer;
  }

  async read(fileName) {
    try {
      const fileHandle = await this.#fs.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      const content = await file.text();
      const serializer = this.#getSerializer(fileName);
      const data = serializer.parse(content);
      return data;
    } catch (error) {
      let domainError = new UnexpectedError("Failed to read file");
      if (error instanceof DOMException) {
        if (error.name === "NotFoundError") {
          domainError = new FileNotFoundError();
        }
        if (error.name === "NotAllowedError") {
          domainError = new AuthorizationError();
        }
      }
      domainError.cause = error;
      domainError.meta = { fileName };
      throw domainError;
    }
  }

  async write(fileName, data) {
    try {
      const fileHandle = await this.#fs.getFileHandle(fileName, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      const serializer = this.#getSerializer(fileName);
      await writable.write(serializer.stringify(data));
      await writable.close();
    } catch (error) {
      let domainError = new UnexpectedError("Failed to write file");
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          domainError = new AuthorizationError();
        }
      }
      domainError.cause = error;
      domainError.meta = { fileName };
      throw domainError;
    }
  }
}

export { FileSystem };
