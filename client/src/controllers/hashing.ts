import { Contract } from "web3-eth-contract";
import { Web3State } from "../contexts/state";
import { Content, ContentType } from "../model/Content";
import { postRequest } from "./clientRequest";

export async function submitDigitalContent(
  file: File,
  content: Content,
  web3: Web3State,
  contentType: ContentType
) {
  // submit to backend (hash and ipfs)
  // upload to blockchain
  try {
    if (contentType === ContentType.IMAGE) {
      await submitImage(file, content, web3);
    } else if (contentType === ContentType.AUDIO) {
      await submitAudio(file, content, web3);
    } else {
      await submitText(file, content, web3);
    }
  } catch (err) {
    console.log(err);
  }
}

async function submitImage(
  image: File,
  content: Content,
  web3: Web3State
): Promise<any> {
  try {
    const response = await postImage(image);
    content.IPFSAddress = response.cid;
    content.pHash = response.hash;
    const contractResponse = await web3.contract?.methods
      .addImageContent(
        content.pHash,
        content.IPFSAddress,
        content.title,
        content.ownerName,
        content.ownerEmail,
        content.desc,
        content.price
      )
      .send({ from: web3.accounts[0] });
    console.log(contractResponse);
  } catch (err) {
    throw new Error();
  }
}

async function submitAudio(
  audio: File,
  content: Content,
  web3: Web3State
): Promise<any> {
  try {
    const response = await postAudio(audio);
    content.IPFSAddress = response.cid;
    content.pHash = response.hash;
    const contractResponse = await web3.contract?.methods
      .addAudioContent(
        content.pHash,
        content.IPFSAddress,
        content.title,
        content.ownerName,
        content.ownerEmail,
        content.desc,
        content.price
      )
      .send({ from: web3.accounts[0] });
    console.log(contractResponse);
  } catch (err) {
    console.log(err);
    throw new Error();
  }
}

async function submitText(
  text: File,
  content: Content,
  web3: Web3State
): Promise<any> {
  try {
    const response = await postText(text);
    content.IPFSAddress = response.cid;
    content.pHash = response.hash;
    const contractResponse = await web3.contract?.methods
      .addTextContent(
        content.pHash,
        content.IPFSAddress,
        content.title,
        content.ownerName,
        content.ownerEmail,
        content.desc,
        content.price
      )
      .send({ from: web3.accounts[0] });
    console.log(contractResponse);
  } catch (err) {
    throw new Error();
  }
}

export function postImage(image: File): Promise<any> {
  const formData = new FormData();
  formData.append("image", image);
  return postRequest("/submit/image", undefined, formData);
}

export function postAudio(audio: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("audio", audio);

    return postRequest("/submit/audio", undefined, formData);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export function postText(text: File): Promise<any> {
  const formData = new FormData();
  formData.append("text", text);
  return postRequest("/submit/text", undefined, formData);
}

// hashing and upload to ipfs

export const hashImage = (image: File): Promise<string> =>
  postRequest("/hash/image", image, "jf");
