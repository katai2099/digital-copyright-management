import { AxiosError } from "axios";
import { getContentsByContentType, getAudioByHash } from "../database/content";
import { ISubmitResponse, SubmitResponse } from "../models/common";
import { Content, ContentType } from "../models/Content";
import { HashingError } from "../utils/Error";
import { isSimilarHammingDistance, hexToBin, convert } from "../utils/utils";
import {
  compareImageHash,
  compareTextHash,
  getAudioHash,
  getImageHash,
  getTextHash,
} from "./hashing";
import { uploadFileToIPFS } from "./ipfs";

export const submitImage = async (image: Buffer): Promise<SubmitResponse> => {
  try {
    const hash = await getImageHash(image);
    await compareImageHash(hash);
    const cid = await uploadFileToIPFS(image);
    // const cid = await Hash.of(image);
    return { hash: hash, cid: cid } as ISubmitResponse;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const submitText = async (textFile: Buffer): Promise<SubmitResponse> => {
  try {
    const text = Buffer.from(textFile).toString();
    const hash = await getTextHash(text);
    await compareTextHash(hash);
    const cid = await uploadFileToIPFS(textFile);
    //const cid = await Hash.of(textFile);
    return { hash: hash, cid: cid } as ISubmitResponse;
  } catch (err) {
    console.log(err);
    throw err;
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
        throw new HashingError(
          content.id,
          "Audio with similar content already exists"
        );
      }
    }
  }
};
