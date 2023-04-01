import { Agreement } from "../models/Agreement";
import { prisma } from "./prisma";

export async function createAgreement(agreement: Agreement) {
  try {
    const newAgreement = await prisma.agreements.create({
      data: {
        id: agreement.id,
        licensee: agreement.licensee,
        licenser: agreement.licenser,
        contentId: agreement.contentId,
        purposeOfUse: agreement.purposeOfUse,
        transactionHash: agreement.transactionHash,
        timestamp: agreement.timestamp,
      },
    });
    return newAgreement;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function getAgreementByWalletAddress(walletAddress: string) {
  try {
    const agreements = await prisma.agreements.findMany({
      where: {
        licensee: walletAddress,
      },
      include: {
        licensers: true,
      },
    });
    return agreements;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
