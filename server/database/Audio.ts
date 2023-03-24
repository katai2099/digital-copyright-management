import { Audio, PrismaClient } from "@prisma/client";
import { Content } from "../models/content";

const prisma = new PrismaClient();

export async function createNewAudio(content: Content): Promise<Audio> {
  try {
    const audio = await prisma.audio.create({
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
    return audio;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getAllAudio(): Promise<Audio[]> {
  try {
    const audio = await prisma.audio.findMany();
    return audio;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getAudioByHash(hash: string): Promise<Audio> {
  try {
    const audio = await prisma.audio.findFirstOrThrow({
      where: {
        pHash: hash,
      },
    });
    return audio;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
