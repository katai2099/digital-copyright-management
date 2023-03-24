import { Text, PrismaClient } from "@prisma/client";
import { Content } from "../models/content";

const prisma = new PrismaClient();

export async function createNewText(content: Content): Promise<Text> {
  try {
    const text = await prisma.text.create({
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
    return text;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getAllTexts(): Promise<Text[]> {
  try {
    const text = await prisma.text.findMany();
    return text;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
