import React, { useState } from "react";
import { UseEth } from "../../contexts/UseEth";
import { hashImage } from "../../controllers/hashing";
import { addImageToIPFS } from "../../controllers/ipfs";
import { CopyrightImage } from "../../model/CopyrightImage";
import { hexToBin } from "../../utils";
import { Backdrop } from "../common/Backdrop";
import {
  BlockchainDeploymentLoading,
  DeploymentStep,
} from "../common/BlockchainDeploymentLoading";
import { ExistingContent } from "./ExistingContent";
import "./home2.css";

export const Home = () => {
  const { state } = UseEth();
  const [selectedImage, setSelectedImage] = useState<File>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployStep, setDeployStep] = useState(DeploymentStep.HASH);
  const [existImage, setExistImage] = useState(new CopyrightImage());
  const [displayExistImage, setDisplayExistImage] = useState(false);

  const stopDisplayExistImage = () => {
    setDisplayExistImage(false);
  };

  const startDisplayExistImage = () => {
    setDisplayExistImage(true);
  };

  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const emailChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const imageTitleChangeHandler = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setImageTitle(event.currentTarget.value);
  };

  function isError(): boolean {
    return existImage.ownerAddress !== "";
  }

  function hammingDistanceCompare(
    firstHash: string,
    secondHash: string
  ): boolean {
    if (firstHash.length !== secondHash.length) return false;
    let dist = 0;
    for (let i = 0; i < firstHash.length; i++) {
      if (firstHash[i] !== secondHash[i]) {
        dist += 1;
      }
    }
    return dist / firstHash.length <= 0.3;
  }

  function createAsyncObject(
    i: number,
    submitCopyrightImage: CopyrightImage
  ): Promise<CopyrightImage> {
    return new Promise((resolve, reject) => {
      state
        .contract!.methods.images(i)
        .call()
        .then((image: CopyrightImage) => {
          if (
            submitCopyrightImage.pHash === image.pHash ||
            hammingDistanceCompare(
              hexToBin(image.pHash),
              hexToBin(submitCopyrightImage.pHash)
            )
          ) {
            reject(image);
          }
          resolve(image);
        });
    });
  }

  function submitDigitalContent(): Promise<any> {
    const submitCopyrightImage = new CopyrightImage(
      0,
      "",
      "",
      name,
      email,
      imageTitle
    );

    const promises: Promise<CopyrightImage>[] = [];

    return new Promise((resolve, reject) => {
      hashImage(selectedImage)
        .then((hash) => {
          submitCopyrightImage.pHash = hash;
          //get Image Count in contract otherwise
          return state.contract?.methods.imageCount().call();
        })
        .then((count) => {
          for (let i = 0; i < count; i++) {
            promises.push(createAsyncObject(i, submitCopyrightImage));
          }

          return Promise.all(promises);
        })
        .then(() => {
          return addImageToIPFS(selectedImage);
        })
        .then((cid) => {
          submitCopyrightImage.IPFSAddress = cid!;

          setDeployStep(DeploymentStep.DEPLOY);
          return addCopyrightImageToSmartContract(submitCopyrightImage);
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setLoading(true);

    submitDigitalContent()
      .then((res) => {
        setLoading(false);
        setDeployStep(DeploymentStep.HASH);
      })
      .catch((err) => {
        setExistImage(err);

        setLoading(false);

        setDeployStep(DeploymentStep.HASH);
      });
  };

  // const uploadImageToIPFS = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   // console.log('this is called')
  //   addImageToIPFS(selectedImage)
  //     .then((res) => {
  //       console.log(res);
  //       addCopyrightImageToSmartContract(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const imageClickHandler = () => {
    document.getElementById("uploadImage")!.click();
  };

  const selectImageHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      setSelectedImage(event.currentTarget.files[0]);
    }
  };

  //add to smart contract
  function addCopyrightImageToSmartContract(
    image: CopyrightImage
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      state.contract?.methods
        .addImage(
          image.pHash,
          image.IPFSAddress,
          image.imageTitle,
          image.ownerName,
          image.ownerEmail
        )
        .send({ from: state.accounts[0] })
        .then((res: any) => {
          return resolve(res);
        })
        .catch((err: any) => {
          return reject(err);
        });
    });
  }

  const test = () => {
    document.getElementById("uploadImage")!.click();
  };

  return (
    <div className="copyright-upload-container">
      {displayExistImage && (
        <ExistingContent
          copyrightImage={existImage}
          onConfirm={stopDisplayExistImage}
        />
      )}
      {loading && (
        <div>
          <Backdrop onClick={stopDisplayExistImage} />
          <BlockchainDeploymentLoading step={deployStep} />
        </div>
      )}
      <form onSubmit={submitHandler}>
        <div className="form-group mb-3">
          <input
            //  value={name}
            type="text"
            className="form-control"
            placeholder="Owner full name"
            required={true}
            onBlur={nameChangeHandler}
          />
        </div>
        <div className="form-group mb-3">
          <input
            //    value={email}
            type="email"
            className="form-control"
            placeholder="Owner Email address"
            required={true}
            onBlur={emailChangeHandler}
          />
        </div>
        <div className="form-group mb-3">
          <input
            // value={imageTitle}
            type="text"
            className="form-control"
            placeholder="Title"
            required={true}
            onBlur={imageTitleChangeHandler}
          />
        </div>
        {/* {selectedImage != null && (
          <div className="image-display" onClick={imageClickHandler}>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="copyright-content"
              style={{ maxWidth: "100%" }}
            />
          </div>
        )} */}
        <div className="form-group mb-3">
          <div className="image-display" onClick={test}>
            <img
              src={
                selectedImage == null
                  ? "./img/icons8-upload-100.png"
                  : URL.createObjectURL(selectedImage)
              }
              id="displayImage"
              alt="Whatever"
            />
            <span className="mt-3">Select image</span>
          </div>
          <input
            hidden={true}
            type="file"
            className="form-control"
            accept="image/png, image/jpg, image/jpeg, image/WebP"
            id="uploadImage"
            onChange={selectImageHandler}
          />
        </div>
        <button type="submit" className="form-control btn btn-dark btn-block">
          Submit
        </button>
        {true && (
          <div style={{ marginTop: "20px" }}>
            <p>Image already exist.</p>
            <p>
              For more information{" "}
              <span
                className="btn btn-click-here"
                onClick={startDisplayExistImage}
              >
                <b>
                  <u>Click here</u>
                </b>
              </span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
