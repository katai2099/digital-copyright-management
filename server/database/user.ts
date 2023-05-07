import { users } from "@prisma/client";
import { IUser } from "../models/User";
import { DatabaseError, handlePrismaError } from "../utils/Error";
import { prisma } from "./prisma";

export async function createUser(user: IUser): Promise<users> {
  // error unique email or unique username
  try {
    const newUser = await prisma.users.create({
      data: {
        walletAddress: user.walletAddress,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
    return newUser;
  } catch (err: any) {
    return handlePrismaError(err);
  }
}

export async function getUserByWalletAddress(
  walletAddress: string
): Promise<users> {
  try {
    const user = await prisma.users.findFirstOrThrow({
      where: {
        OR: [
          {
            walletAddress: walletAddress,
          },
        ],
      },
    });
    return user;
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new DatabaseError(err.message, 404);
    }
    return handlePrismaError(err);
  }
}

export async function updateUser(user: IUser): Promise<users> {
  try {
    const updateUser = await prisma.users.update({
      where: {
        walletAddress: user.walletAddress,
      },
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
    return updateUser;
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function getUsersBySearchTerm(
  searchQuery: string
): Promise<users[]> {
  try {
    const users = await prisma.users.findMany({
      where: {
        OR: [
          {
            firstname: {
              contains: searchQuery,
            },
          },
          {
            lastname: { contains: searchQuery },
          },
        ],
      },
    });
    return users;
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function getUserByEmail(email: string): Promise<users | null> {
  try {
    const user = await prisma.users.findFirst({
      where: { email: email },
    });
    return user;
  } catch (error) {
    return handlePrismaError(error);
  }
}
