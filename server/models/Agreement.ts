interface IAgreement {
  licensee: string;
  licenser: string;
  contentId: number;
  purposeOfUse: string;
  timestamp: string;
  id?: number;
}

export class Agreement implements IAgreement {
  id?: number;
  constructor(
    public licensee: "",
    public licenser: "",
    public contentId = 0,
    public purposeOfUse = "",
    public timestamp = "",
    id?: number
  ) {
    if (id) {
      this.id = id;
    }
  }
}
