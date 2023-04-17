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
        fieldOfUse: agreement.fieldOfUse,
        price: agreement.price,
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

//licenser
export async function getLicenserAgreement(
  walletAddress: string,
  page: number
) {
  try {
    const agreements = await prisma.agreements.findMany({
      where: {
        licenser: walletAddress,
      },
      include: {
        licensers: true,
        licensees: true,
        content: true,
      },
      skip: (page - 1) * 15,
      take: 15,
    });

    return agreements;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

//licensing
export async function getLicensingAgreement(
  walletAddress: string,
  page: number
) {
  try {
    const agreements = await prisma.agreements.findMany({
      where: {
        licensee: walletAddress,
      },
      include: {
        licensers: true,
        licensees: true,
        content: true,
      },
      skip: (page - 1) * 15,
      take: 15,
    });
    return agreements;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
