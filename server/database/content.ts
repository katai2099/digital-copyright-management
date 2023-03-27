import { Content, Prisma } from "@prisma/client";
import { ContentType, IContent } from "../models/content";
import { prisma } from "./prisma";

export async function createContent(content: IContent): Promise<Content> {
  try {
    const newContent = await prisma.content.create({
      data: {
        contentId: content.Id,
        contentType: content.contentType,
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
    return newContent;
  } catch (error) {
    throw new Error();
  }
}

export async function getAllContentByContentType(
  contentType: ContentType
): Promise<Content[]> {
  try {
    const contents = await prisma.content.findMany({
      where: {
        contentType: contentType,
      },
    });
    return contents;
  } catch (error) {
    throw new Error();
  }
}

export async function getAudioByHash(hash: string): Promise<Content> {
  try {
    const content = await prisma.content.findFirstOrThrow({
      where: {
        AND: [
          {
            pHash: hash,
          },
          {
            contentType: ContentType.AUDIO,
          },
        ],
      },
    });
    return content;
  } catch (error) {
    throw new Error();
  }
}

// export async function getAllLatestContents(): Promise<any> {
//   try {
//     const contents = await prisma.$queryRaw(
//       Prisma.sql`select id,contentId,contentTYpe, ownerAddress,pHash, IPFSAddress,title,ownerName,ownerEmail,"desc",price,publishDate from (select * , Rank() over (partition by contentType order by publishDate desc) as rankk from Content) rs where rankk<=5`
//     );
//     return contents;
//   } catch (error) {
//     throw new Error();
//   }
// }

export async function getLatestContents(
  contentType: ContentType
): Promise<Content[]> {
  try {
    const contents = await prisma.content.findMany({
      take: 15,
      where: {
        contentType: contentType,
      },
      orderBy: {
        publishDate: "desc",
      },
    });
    return contents;
  } catch (error) {
    throw new Error();
  }
}
