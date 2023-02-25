import { BufferObject, imageHash } from "image-hash";
import {Tlsh} from "tlsh_ts"



export const getImageHash = async (image: Buffer) => {
    const tmpImage = {data:image } as BufferObject;
   const res =  await test(tmpImage);
    return res;
}

export const getTextHash = async (text: string) => {
    try{
        let hasher = new Tlsh()
        await hasher.update(text);
        await hasher.finale();
        let hash = await hasher.hash();
        return hash;
    }catch(err){
        console.log(err)
    }

}

function test(image : BufferObject){
    return new Promise(resolve=>{
        imageHash(image,16,true,(err : any,hash : string)=>{
            console.log(hash);
            return resolve(hash);
    })
    });
}