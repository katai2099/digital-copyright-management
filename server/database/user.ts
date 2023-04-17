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
        username: user.username === "" ? user.walletAddress : user.username,
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
          {
            username: walletAddress,
          },
        ],
      },
    });
    return user;
  } catch (err: any) {
    console.log(err);
    throw new DatabaseError(err.message, 410);
  }
}

export async function updateUser(user: IUser): Promise<users> {
  try {
    const updateUser = await prisma.users.update({
      where: {
        walletAddress: user.walletAddress,
      },
      data: {
        username: user.username === "" ? user.walletAddress : user.username,
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
          {
            username: { contains: searchQuery },
          },
        ],
      },
    });
    return users;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
