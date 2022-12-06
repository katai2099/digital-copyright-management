import { postRequest } from "./clientRequest";

export const hashImage = (image : any) : Promise<string> => postRequest("http://localhost:8082/hashing/imageHash",image);