import { AxiosError } from "axios";
import { getContentsByContentType, getAudioByHash } from "../database/content";
import { ISubmitResponse, SubmitResponse } from "../models/common";
import { Content, ContentType } from "../models/Content";
import { HashingError } from "../utils/Error";
import {
  isSimilarHammingDistance,
  hexToBin,
  clone,
  convert,
} from "../utils/utils";
import { getAudioHash, getImageHash, getTextHash } from "./hashing";
import { uploadFileToIPFS } from "./ipfs";
const Hash = require("pure-ipfs-only-hash");

export const submitImage = async (image: Buffer): Promise<SubmitResponse> => {
  try {
    const hash = await getImageHash(image);
    const images = await getContentsByContentType(ContentType.IMAGE);
    console.log(images);
    for (const image of images) {
      // if (
      //   image.pHash == hash ||
      //   isSimilarHammingDistance(hexToBin(image.pHash), hexToBin(hash))
      // ) {
      //   throw new Error("Image already existed");
      // }
    }
    // const cid = await uploadFileToIPFS(image);
    const cid = await Hash.of(image);
    return { hash: hash, cid: cid } as ISubmitResponse;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};

export const submitText = async (textFile: Buffer): Promise<SubmitResponse> => {
  try {
    const text = Buffer.from(textFile).toString();
    const hash = await getTextHash(text);
    console.log(hash);
    const texts = await getContentsByContentType(ContentType.TEXT);
    console.log(hash);
    for (const text of texts) {
      if (
        text.pHash == hash ||
        isSimilarHammingDistance(hexToBin(text.pHash), hexToBin(hash))
      ) {
        throw new Error("Text file with similar content already existed");
      }
    }
    const cid = await uploadFileToIPFS(textFile);
    //const cid = await Hash.of(textFile);
    return { hash: hash, cid: cid } as ISubmitResponse;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const submitAudio = async (audio: Buffer, filename: string) => {
  try {
    const hash = await getAudioHash(audio, filename);
    const cid = await uploadFileToIPFS(audio);
    //const cid = await Hash.of(audio);
    return { hash: hash, cid: cid } as ISubmitResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status == 400) {
        const sha = error.response.data;
        const audio = await getAudioByHash(sha);
        const content = convert<Content>(audio);
        throw new HashingError(content);
      }
    }
  }
};
