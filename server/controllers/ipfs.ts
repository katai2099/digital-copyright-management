import { client } from "../server";


export const uploadNewFile = async (file: Buffer)  =>{
   const {cid} = await client.add(file);
    console.log(cid);
    return cid.toString();
}