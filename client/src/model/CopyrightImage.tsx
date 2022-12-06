interface ICopyrightImage {
  imageID: number;
  pHash: string;
  IPFSAddress: string;
  ownerName: string;
  ownerEmail: string;
  imageTitle: string;
  publishDate: string;
  ownerAddress: string;
}

export class CopyrightImage implements ICopyrightImage {
  constructor(
    public imageID = 0,
    public pHash = "",
    public IPFSAddress = "",
    public ownerName = "",
    public ownerEmail = "",
    public imageTitle = "",
    public publishDate = "",
    public ownerAddress = ""
  ) {}
}
