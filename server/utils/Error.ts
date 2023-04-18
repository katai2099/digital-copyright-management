import { InternalServerError as serverErrorMsg } from "../models/common";

import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export class HashingError extends Error {
  contentId: number = 0;
  errorCode: number = 409;
  constructor(contentId: number, errorMsg?: string, errorCode?: number) {
    super(errorMsg);
    this.contentId = contentId;
    if (errorCode) {
      this.errorCode = errorCode;
    }
  }
}

export class InternalServerError extends Error {
  errorCode: number = 500;
  constructor() {
    super(serverErrorMsg);
  }
}

export class DatabaseError extends Error {
  errorCode: number = 400;
  constructor(errorMsg: string, errorCode?: number) {
    super(errorMsg);
    if (errorCode) {
      this.errorCode = errorCode;
    }
  }
}

export const handlePrismaError = (err: any) => {
  console.log(err.message);

  if (err instanceof PrismaClientKnownRequestError) {
    const splitErrorMsg = err.message.split("\n");
    const errMsg = splitErrorMsg[4] ? splitErrorMsg[4] : err.message;
    throw new DatabaseError(errMsg);
  } else if (err instanceof PrismaClientValidationError) {
    // Argument where of type usersWhereUniqueInput needs at least one argument.
    console.log("PrismaClientValidationError");
    throw new DatabaseError(err.message);
  } else if (err instanceof PrismaClientRustPanicError) {
    console.log("PrismaClientRustPanicError");
    throw new DatabaseError(err.message);
  } else if (err instanceof PrismaClientUnknownRequestError) {
    console.log("PrismaClientUnknownRequestError");
    throw new DatabaseError(err.message);
  }
  throw new InternalServerError();
};

export const BODY_VALIDATION_FAIL = "Body validation failed";
