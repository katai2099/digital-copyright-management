import { Content, Prisma } from "@prisma/client";
import { FilterType, IContentFilter } from "../models/common";
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

export async function getContentsByContentType(
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

export async function getContentByhash(hash: string): Promise<Content> {
  try {
    const content = await prisma.content.findFirstOrThrow({
      where: {
        pHash: hash,
      },
    });
    return content;
  } catch (error) {
    throw new Error();
  }
}

function getFilterName(filter: FilterType): string {
  if (filter === FilterType.HIGHEST || filter === FilterType.LOWEST) {
    return "price";
  }
  return "publishDate";
}

export async function getContents(filter: IContentFilter): Promise<Content[]> {
  try {
    let contents: Content[] | PromiseLike<Content[]> = [];
    if (
      filter.sort === FilterType.LATEST ||
      filter.sort === FilterType.OLDEST
    ) {
      const publishDateContents = await prisma.content.findMany({
        where: {
          contentType: filter.content,
        },
        orderBy: {
          publishDate: filter.sort === FilterType.LATEST ? "desc" : "asc",
        },
        skip: filter.page * 20,
        take: 20,
      });
      contents = publishDateContents;
      console.log(publishDateContents);
    } else {
      const priceContents = await prisma.content.findMany({
        where: {
          contentType: filter.content,
        },
        orderBy: {
          price: filter.sort === FilterType.HIGHEST ? "desc" : "asc",
        },
        skip: filter.page * 20,
        take: 20,
      });
      contents = priceContents;
    }
    return contents;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
