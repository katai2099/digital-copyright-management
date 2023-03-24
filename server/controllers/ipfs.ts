import { client } from "../server";
export const uploadFileToIPFS = async (file: Buffer) => {
  try {
    client.config.set("duplex", "half");
    const { cid } = await client.add(file);
    console.log(cid);
    return cid.toString();
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};
