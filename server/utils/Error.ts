import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Content } from "../models/content";

export class HashingError extends Error {
  content: Content;
  errorCode: number = 0;
  constructor(content: Content, errorMsg?: string, errorCode?: number) {
    super(errorMsg);
    this.content = content;
    if (errorCode) {
      this.errorCode = errorCode;
    }
  }
}

export class DatabaseError extends Error {
  errorCode: number = 500;
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
    // An operation failed because it depends on one or more records that were required but not found. Record to update not found.

    // Unique constraint failed on the constraint: `users_username_key`
    console.log("PrismaClientKnownRequestError");
    console.log(err.meta);
    throw new DatabaseError(err.message);
  } else if (err instanceof PrismaClientValidationError) {
    // Argument where of type usersWhereUniqueInput needs at least one argument.
    console.log("PrismaClientValidationError");
    throw new DatabaseError(err.message);
  } else if (err instanceof PrismaClientRustPanicError) {
    console.log("PrismaClientRustPanicError");
  } else if (err instanceof PrismaClientUnknownRequestError) {
    console.log("PrismaClientUnknownRequestError");
  }
  throw new DatabaseError(err.message);
};

export const BODY_VALIDATION_FAIL = "Body validation failed";
