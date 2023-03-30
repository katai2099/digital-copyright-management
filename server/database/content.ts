import { contents } from "@prisma/client";
import { FilterType } from "../models/common";
import { ContentType, IContent, IContentFilter } from "../models/Content";
import { prisma } from "./prisma";

export async function createContent(content: IContent): Promise<contents> {
  try {
    const newContent = await prisma.contents.create({
      data: {
        id: content.id,
        contentType: content.contentType,
        ownerAddress: content.ownerAddress,
        pHash: content.pHash,
        IPFSAddress: content.IPFSAddress,
        title: content.title,
        desc: content.desc,
        price: content.price,
        publishDate: content.publishDate,
      },
    });
    return newContent;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getContentsByContentType(
  contentType: ContentType
): Promise<contents[]> {
  try {
    const contents = await prisma.contents.findMany({
      where: {
        contentType: contentType,
      },
    });
    return contents;
  } catch (error) {
    throw new Error();
  }
}

export async function getAudioByHash(hash: string): Promise<contents> {
  try {
    const content = await prisma.contents.findFirstOrThrow({
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
): Promise<contents[]> {
  try {
    const contents = await prisma.contents.findMany({
      take: 15,
      where: {
        contentType: contentType,
      },
      orderBy: {
        publishDate: "desc",
      },
      include: {
        owner: true,
      },
    });
    return contents;
  } catch (error) {
    throw new Error();
  }
}

export async function getContentByhash(hash: string): Promise<contents> {
  try {
    const content = await prisma.contents.findFirstOrThrow({
      where: {
        pHash: hash,
      },
      include: {
        owner: true,
        event: true,
      },
    });
    return content;
  } catch (error) {
    throw new Error();
  }
}

export async function getContents(filter: IContentFilter): Promise<contents[]> {
  try {
    const isPublishDateFilter =
      filter.sort === FilterType.LATEST || filter.sort === FilterType.OLDEST;
    const contents = await prisma.contents.findMany({
      where: {
        AND: [
          {
            contentType: filter.content,
          },
          {
            title: {
              contains: filter.q,
            },
          },
        ],
      },
      orderBy: {
        ...(isPublishDateFilter
          ? {
              publishDate: filter.sort === FilterType.LATEST ? "desc" : "asc",
            }
          : { price: filter.sort === FilterType.HIGHEST ? "desc" : "asc" }),
      },
      include: {
        owner: true,
      },
      skip: filter.page * 15,
      take: 15,
    });
    return contents;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getContentsByWalletAddress(
  walletAddress: string,
  filter: IContentFilter
): Promise<contents[]> {
  const isPublishDateFilter =
    filter.sort === FilterType.LATEST || filter.sort === FilterType.OLDEST;

  try {
    const contents = await prisma.contents.findMany({
      where: {
        AND: [
          {
            contentType: filter.content,
            ownerAddress: walletAddress,
          },
          {
            title: {
              contains: filter.q,
            },
          },
        ],
      },
      orderBy: {
        ...(isPublishDateFilter
          ? {
              publishDate: filter.sort === FilterType.LATEST ? "desc" : "asc",
            }
          : { price: filter.sort === FilterType.HIGHEST ? "desc" : "asc" }),
      },
      skip: filter.page * 15,
      take: 15,
    });
    return contents;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
