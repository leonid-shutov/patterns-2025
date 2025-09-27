"use strict";

class DomainError extends Error {
  constructor(message, options) {
    const { code, meta, ...restOptions } = options;
    super(message, restOptions);
    this.code = code;
    this.meta = meta;
    this.name = this.constructor.name;
  }
}

const createDomainError = (className, factoryOptions) =>
  class extends (factoryOptions.parent ?? DomainError) {
    constructor(messageOrOptions, options) {
      let message;
      if (typeof messageOrOptions === "string") {
        message = messageOrOptions ?? factoryOptions.message;
      } else {
        message = factoryOptions.message;
        options = messageOrOptions;
      }
      const code = options?.code ?? factoryOptions.code;
      super(message, { ...options, code });
      this.name = className;
    }
  };

const UnexpectedError = createDomainError("UnexpectedError", {
  message: "Unexpected Error",
  code: "UNEXPECTED_ERROR",
});

const NotFoundError = createDomainError("NotFoundError", {
  message: "Not Found",
  code: "NOT_FOUND",
});

const AuthorizationError = createDomainError("AuthorizationError", {
  message: "Authorization Error",
  code: "AUTHORIZATION_ERROR",
});

const FileNotFoundError = createDomainError("FileNotFoundError", {
  message: "File not found",
  code: "FILE_NOT_FOUND",
  parent: NotFoundError,
});

const UnsupportedFileExtensionError = createDomainError(
  "UnsopprtedFileExtensionError",
  {
    message: "Unsopported file extension",
    code: "UNSUPORTED_FILE_EXTENSION",
  },
);

export {
  FileNotFoundError,
  UnsupportedFileExtensionError,
  UnexpectedError,
  AuthorizationError,
};
