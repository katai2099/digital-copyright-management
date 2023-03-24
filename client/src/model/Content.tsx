export enum ContentType {
  IMAGE = "Image",
  AUDIO = "Audio",
  TEXT = "Text",
}

interface IContent {
  ownerAddress: string;
  Id: number;
  pHash: string;
  IPFSAddress: string;
  title: string;
  ownerName: string;
  ownerEmail: string;
  desc: string;
  price: number;
  publishDate: string;
}

export class Content implements IContent {
  constructor(
    public ownerAddress = "",
    public Id = 0,
    public pHash = "",
    public IPFSAddress = "",
    public title = "",
    public ownerName = "",
    public ownerEmail = "",
    public desc = "",
    public price = 0,
    public publishDate = ""
  ) {}
}
