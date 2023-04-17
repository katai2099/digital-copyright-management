import { ITransfer } from "../models/Transfer";
import { prisma } from "./prisma";

export async function createTransferEvent(transfer: ITransfer) {
  try {
    const newTransfer = await prisma.transferEvent.create({
      data: {
        transactionHash: transfer.transactionHash,
        from: transfer.from,
        to: transfer.to,
        price: transfer.price,
        timestamp: transfer.timestamp,
      },
    });
    return newTransfer;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getTransferEvent(walletAddress: string, page: number) {
  try {
    const transfers = await prisma.transferEvent.findMany({
      where: {
        OR: [{ from: walletAddress }, { to: walletAddress }],
      },
      orderBy: {
        timestamp: "desc",
      },
      skip: (page - 1) * 15,
      take: 15,
    });
    return transfers;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
