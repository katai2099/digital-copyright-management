import { Prisma, PrismaClient } from "@prisma/client";
import { IAddress } from "../models/Address";
import { IUser } from "../models/User";

const prisma = new PrismaClient();

// USER

export async function createNewUser(user: IUser) {
  const res =  await prisma.users.create({
    data: {
      firstname : user.firstname,
      lastname: user.lastname,
      email : user.email,
      password: user.password,
      address : user.address,
    }
  })
  return res;
}

export async function findUserByName(name: string){
  const res = await prisma.users.findMany({
    where : {
      OR: [
        {
          firstname : {
            startsWith : name
          },
          lastname : {
            startsWith : name
          }
        }
      ]
    }
  })
  return res;
}

export async function findUserById(id : number){
  const res = await prisma.users.findUnique({
    where : {
      id : id
    }
  })
}

export async function findUserByEmail(email: string){
  const res = await prisma.users.findFirst({
    where: {
      email : email
    }
  })
  return res;
}

// WALLET

export async function findWalletByUserId(userId: number){
  const res = await prisma.wallet.findMany({
    where : {
      userId : userId
    }
  })
  return res;
}


export async function addNewUserWallet(address: IAddress){
  const newAddress = await prisma.wallet.create({
    data:{
      userId : parseInt(address.userId),
      hash: address.address,
    }
  })
  return newAddress;
}

export async function getAllUserWalletAddresses(userId: number){
  const addresses = await prisma.wallet.findMany({
    where : {
      userId : userId
    }
  })
  return addresses;
}

