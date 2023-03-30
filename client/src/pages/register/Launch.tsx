import { useEffect, useState } from "react";
import { RadioOption } from "../../components/option/RadioOption";
import { ContentTypes } from "../../constant";
import { coinRateActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import { submitDigitalContent } from "../../controllers/content";
import { getCoinRate } from "../../controllers/web3";
import { Content, ContentType } from "../../model/Content";
import "./launch.css";

export const Launch = () => {
  //TODO: Add loading modal when upload
  // handle when error

  //TODO: automatically convert usd to ether

  //TODO: cache pending content so that user wont be able to submit new content

  const { state, dispatch } = UseDcm();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [content, setContent] = useState<Content>(new Content());
  const [fileType, setFileType] = useState<ContentType>(ContentType.IMAGE);

  useEffect(() => {
    getCoinRate().then((rate) => {
      dispatch({ type: coinRateActions.set, data: rate });
    });
  }, [dispatch]);

  const fileChangeHandler = () => {
    document.getElementById("uploadFile")!.click();
  };
  const selectFileHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      setSelectedFile(event.currentTarget.files[0]);
    }
  };
  const submitButtonClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    submitDigitalContent(selectedFile!, content, state, fileType)
      .then((res) => {
        alert("Content Register Successfully");
        console.log(res);
      })
      .catch((error) => {
        alert("Content Register Failed");
        console.log(error);
      });
    // state.web3State.contract?.methods
    //   .updateContentData(1, "test", 343)
    //   .send({ from: state.web3State.account });
    console.log("click");
    console.log(state.web3State.account);

    // state.web3State.contract?.methods
    //   .licensingContent(1, "purpose rich")
    //   .send({ from: state.web3State.account, value: 1000 });
  };

  const fileTypeChangeHandler = (type: string) => {
    console.log(state.user);
    const contentType = type as ContentType;
    if (contentType !== fileType) {
      setFileType(contentType);
      setSelectedFile(undefined);
    }
  };

  const acceptFileType = getAcceptFileType(fileType);

  const priceInEther = content.price * state.coinRate.USDToETH;

  return (
    <div className="home-wrapper">
      <header className="launch-content-header">
        <h2>Submit a Content</h2>
        <h4>Submit to copyright your content </h4>
      </header>
      <hr className="divider" />
      <div className="launch-form-area">
        <div className="information-area">
          <form className="information-form">
            <label className="input-label">Title</label>
            <input
              type="text"
              onBlur={(event) => {
                setContent({ ...content, title: event.currentTarget.value });
              }}
            />
            <label className="input-label">Owner</label>
            <input
              type="text"
              value={`${state.user.firstname} ${state.user.lastname}`}
              disabled
            />
            <label className="input-label">Email</label>
            <input type="email" value={state.user.email} disabled />
            <label className="input-label">Description</label>
            <textarea
              onBlur={(event) => {
                setContent({ ...content, desc: event.currentTarget.value });
              }}
            />
            <div className="price-wrapper">
              <div className="price col-sm-4">
                <label className="input-label">Price</label>
                <div>1$ &asymp; {` ${state.coinRate.USDToETH}`}</div>
              </div>
              <input
                className="col-sm-4"
                onBlur={(event) => {
                  console.log("test");
                  setContent({
                    ...content,
                    price: Number(event.currentTarget.value),
                  });
                }}
              />
            </div>
            <div>
              <div>Price in Ether</div>
              <input value={priceInEther} />
            </div>
            <button
              className="submit-button"
              onClick={submitButtonClickHandler}
            >
              Submit
            </button>
          </form>
        </div>
        <div className="content-upload-area">
          <div className="content-preview-header">
            <h3>Preview</h3>
          </div>
          <div className="file-upload-area">
            <div className="file-type-wrapper">
              <div style={{ marginBottom: "8px" }}>File Type</div>
              <RadioOption
                options={ContentTypes}
                optionName={"file-type"}
                onSelected={fileTypeChangeHandler}
              />
            </div>
            <div
              className="content-display-container"
              onClick={fileChangeHandler}
            >
              <img
                src={
                  selectedFile == null
                    ? "./img/icons8-upload-100.png"
                    : fileType === ContentType.AUDIO
                    ? "./img/mp3.png"
                    : fileType === ContentType.TEXT
                    ? "./img/txt.png"
                    : URL.createObjectURL(selectedFile)
                }
                id="displayContent"
                alt="content"
              />
              <div>{selectedFile ? selectedFile.name : "Select file"}</div>
            </div>
            <input
              hidden={true}
              type="file"
              accept={acceptFileType}
              id="uploadFile"
              onChange={selectFileHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );

  function getAcceptFileType(fileType: ContentType): string {
    if (fileType === ContentType.IMAGE) {
      return "image/png, image/jpg, image/jpeg";
    } else if (fileType === ContentType.AUDIO) {
      return "audio/mp3";
    }
    return ".txt";
  }
};
