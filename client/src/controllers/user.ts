import { IUser } from "../model/User";

// export async function login(walletAddress: ILoginPostData) {
//     try {
//       const res = await loginWorker(walletAddress);
//       console.log(res);
//       return res;
//     } catch (error) {
//       throw error;
//     }
//   }

export async function updateUser(user: IUser): Promise<any> {}

async function updateUserWorker(user: IUser): Promise<any> {
  try {
  } catch (error) {}
}

//   async function loginWorker(walletAddress: ILoginPostData): Promise<any> {
//     try {
//       const res = await postRequest<string>(`${AUTH_ROUTE}/login`, walletAddress);
//       return res;
//     } catch (error) {
//       throw error;
//     }
//   }
