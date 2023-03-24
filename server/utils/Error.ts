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
