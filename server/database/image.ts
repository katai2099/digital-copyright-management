import { Image, PrismaClient } from "@prisma/client";
import { IContent } from "../models/content";

const prisma = new PrismaClient();

export async function createNewImage(content: IContent): Promise<Image> {
  try {
    const image = await prisma.image.create({
      data: {
        contentId: content.Id,
        ownerAddress: content.ownerAddress,
        pHash: content.pHash,
        IPFSAddress: content.IPFSAddress,
        title: content.title,
        ownerName: content.ownerName,
        ownerEmail: content.ownerEmail,
        desc: content.desc,
        price: content.price,
        publishDate: content.publishDate,
      },
    });
    return image;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
}

export async function getAllImages(): Promise<Image[]> {
  try {
    const images = await prisma.image.findMany();
    return images;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
