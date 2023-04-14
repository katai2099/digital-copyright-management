import { useEffect, useState } from "react";
import { RadioOption } from "../../components/option/RadioOption";
import { ContentTypes } from "../../constant";
import { coinRateActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import {
  launchFormValidation,
  submitDigitalContent,
} from "../../controllers/content";
import { getCoinRate, getCurrentUsdToEth } from "../../controllers/web3";
import { BaseContent, ContentType } from "../../model/Content";
import "./launch.css";
import { ContentPriceInput } from "../../components/contentPriceInput/ContentPriceInput";
import { Modal } from "../../components/common/Modal";
import { handleError, isObjectEmpty, keyValuePair } from "../../utils";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { IErrorResponse } from "../../model/Common";

export const Launch = () => {
  //TODO: Add loading modal when upload
  // handle when error

  //TODO: automatically convert usd to ether

  //TODO: cache pending content so that user wont be able to submit new content

  const { state, dispatch } = UseDcm();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [content, setContent] = useState<BaseContent>(new BaseContent());
  const [fileType, setFileType] = useState<ContentType>(ContentType.IMAGE);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [currentUsdToEth, setCurrentUsdToEth] = useState<number>(0);
  const [errors, setErrors] = useState<keyValuePair>({});
  const [submitError, setSubmitError] = useState<IErrorResponse>({
    message: "",
    statusCode: 0,
  });

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

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
      if (errors.file) {
        const { file, ...newErrors } = errors;
        setErrors(newErrors);
      }
      setSelectedFile(event.currentTarget.files[0]);
    }
  };
  const submitButtonClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const errors = launchFormValidation(content, selectedFile);
    if (!isObjectEmpty(errors)) {
      console.log(errors);
      setErrors(errors);
      return;
    }
    setDisplayModal(true);
    getCurrentUsdToEth()
      .then((res) => {
        setCurrentUsdToEth(Number(res));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmClickHandler = () => {
    setDisplayModal(false);
    submitDigitalContent(
      selectedFile!,
      content,
      state,
      fileType,
      currentUsdToEth,
      dispatch
    )
      .then((res) => {
        toast.success(
          "Content Registered Successfully. Redirect to Detail page",
          {
            onClose: () => {
              navigate(`/content/${res}`);
            },
            onClick: () => {
              navigate(`/content/${res}`);
            },
          }
        );
      })
      .catch((error) => {
        handleError(error);
        if (error instanceof AxiosError) {
          if (error.response?.data.statusCode === 409) {
            toast.error(error.response.data.message);
            setSubmitError({
              contentId: error.response.data.contentId,
              message: error.response.data.message,
              statusCode: error.response.data.statusCode,
            });
            window.scroll(0, document.body.scrollHeight);
          }
        }
      });
  };

  const fileTypeChangeHandler = (type: string) => {
    console.log(state.user);
    const contentType = type as ContentType;
    if (contentType !== fileType) {
      setFileType(contentType);
      setSelectedFile(null);
    }
  };

  const acceptFileType = getAcceptFileType(fileType);

  return (
    <div className="home-wrapper">
      <Modal
        title={"Please Confirm"}
        open={displayModal}
        onClose={() => {
          setDisplayModal(false);
        }}
        extraZ={true}
        confirmTitle="Confirm"
        onConfirm={confirmClickHandler}
      >
        <div>{`The final price for your content in Eth is ${
          currentUsdToEth * content.price
        }`}</div>
        <div>{`Current USD to ETH rate is ${currentUsdToEth}`}</div>
      </Modal>
      <header className="launch-content-header">
        <h2>Submit a Content</h2>
        <h4>Submit to copyright your content </h4>
      </header>
      <hr className="divider" />
      <div className="launch-form-area">
        <div className="information-area">
          <form className="information-form">
            <fieldset className="field-set form-group border p-3">
              <legend className="w-auto ">Content Information</legend>
              <label className="input-label">Title*</label>
              <input
                className={errors.title ? "textarea-error" : ""}
                type="text"
                onBlur={(event) => {
                  if (errors.title && event.currentTarget.value !== "") {
                    const { title, ...newErrors } = errors;
                    setErrors(newErrors);
                  }
                  setContent({ ...content, title: event.currentTarget.value });
                }}
              />
              {errors.title && <div className="error-text">{errors.title}</div>}
              <label className="input-label">Owner</label>
              <input
                type="text"
                value={`${state.user.firstname} ${state.user.lastname}`}
                disabled
              />
              <label className="input-label">Email</label>
              <input type="email" value={state.user.email} disabled />
              <label className="input-label">Description*</label>
              <textarea
                className={errors.desc ? "textarea-error" : ""}
                rows={3}
                onBlur={(event) => {
                  if (errors.desc && event.currentTarget.value !== "") {
                    const { desc, ...newErrors } = errors;
                    setErrors(newErrors);
                  }
                  setContent({ ...content, desc: event.currentTarget.value });
                }}
              />
              {errors.desc && <div className="error-text">{errors.desc}</div>}
            </fieldset>
            <fieldset className="field-set form-group border p-3">
              <legend className="w-auto ">Copyright info</legend>
              <ContentPriceInput
                onChange={(price: number) => {
                  setContent({ ...content, price: price });
                }}
                ethToUsd={state.coinRate.ETHToUSD}
                usdToEth={state.coinRate.USDToETH}
                onConvert={(price: number) => {
                  setContent({ ...content, price: price });
                }}
              />
              <label>Field of use*</label>
              <textarea
                className={errors.fieldOfUse ? "textarea-error" : ""}
                placeholder="Usually define the scope of license covered and its restriction"
                rows={6}
                onBlur={(event) => {
                  if (errors.fieldOfUse && event.currentTarget.value !== "") {
                    const { fieldOfUse, ...newErrors } = errors;
                    setErrors(newErrors);
                  }
                  setContent({
                    ...content,
                    fieldOfUse: event.currentTarget.value,
                  });
                }}
              />
              {errors.fieldOfUse && (
                <div className="error-text">{errors.fieldOfUse}</div>
              )}
            </fieldset>
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
          {errors.file && (
            <div className="error-text" style={{ paddingLeft: "16px" }}>
              {errors.file}
            </div>
          )}
        </div>
      </div>

      <button className="submit-button" onClick={submitButtonClickHandler}>
        Submit
      </button>
      {submitError.contentId && (
        <div className="already-exist-content">
          {submitError.message}{" "}
          <Link
            className="see-more-detail"
            to={`/content/${submitError.contentId}`}
          >
            Click here
          </Link>{" "}
          to see more detail
        </div>
      )}
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
