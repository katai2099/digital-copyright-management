import { postRequest } from "./clientRequest";

export const addImageToIPFS = (image : any) : Promise<string> => postRequest("http://localhost:8082/ipfs/uploadFile",image); 