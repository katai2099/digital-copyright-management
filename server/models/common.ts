export interface ISubmitResponse {
  hash: string;
  cid: string;
}

export class SubmitResponse implements ISubmitResponse {
  constructor(public hash = "", public cid = "") {}
}
