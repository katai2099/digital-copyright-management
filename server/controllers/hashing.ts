import { AxiosError } from "axios";
import { BufferObject, imageHash } from "image-hash";
import { Tlsh } from "tlsh_ts";
import { axiosRequest } from "./networkCall";
import { getContentsByContentType } from "../database/content";
import { ContentType } from "../models/Content";
import { hexToBin, isSimilarHammingDistance } from "../utils/utils";
import { HashingError } from "../utils/Error";

export const compareImageHash = async (hash: string): Promise<void> => {
  const images = await getContentsByContentType(ContentType.IMAGE);
  for (const image of images) {
    if (
      image.pHash == hash ||
      isSimilarHammingDistance(hexToBin(image.pHash), hexToBin(hash))
    ) {
      throw new HashingError(image.id, "Image already existed");
    }
  }
};

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

export const compareTextHash = async (hash: string): Promise<void> => {
  const texts = await getContentsByContentType(ContentType.TEXT);
  console.log(hash);
  for (const text of texts) {
    if (
      text.pHash == hash ||
      isSimilarHammingDistance(hexToBin(text.pHash), hexToBin(hash))
    ) {
      throw new HashingError(
        text.id,
        "Text file with similar content already existed"
      );
    }
  }
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
