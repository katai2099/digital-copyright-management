import { AxiosError } from "axios";
import { BufferObject, imageHash } from "image-hash";
import { Tlsh } from "tlsh_ts";
import { hexToBin, isSimilarHammingDistance } from "../utils/utils";
import { axiosRequest } from "./networkCall";

export const getImageHash = async (image: Buffer): Promise<string> => {
  const tmpImage = { data: image } as BufferObject;
  return new Promise((resolve, reject) => {
    imageHash(tmpImage, 16, true, (err: any, hash: string) => {
      if (err) {
        reject(err);
      }
      console.log(hash);
      resolve(hash);
    });
  });
};

export const getTextHash = async (text: string) => {
  try {
    let hasher = new Tlsh();
    await hasher.update(text);
    await hasher.finale();
    let hash = await hasher.hash();
    return hash.toString();
  } catch (err) {
    console.log(err);
    throw new Error("Error");
  }
};

export const getAudioHash = async (audio: Buffer, filename: string) => {
  const formData = new FormData();
  formData.append("audio", new Blob([audio]), filename);
  try {
    const res = await axiosRequest(
      "/hash/audio",
      "POST",
      undefined,
      undefined,
      formData
    );
    return res.data;
  } catch (err) {
    // console.log(err);
    if (err instanceof AxiosError) {
      throw err;
    }
  }
};
