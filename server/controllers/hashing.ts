import { BufferObject, imageHash } from "image-hash";

export const getImageHash = async (image: Buffer) => {
    const tmpImage = {data:image } as BufferObject;
   const res =  await test(tmpImage);
    return res;
}

function test(image : BufferObject){
    return new Promise(resolve=>{
        imageHash(image,16,true,(err : any,hash : string)=>{
            console.log(hash);
            return resolve(hash);
    })
    });
}