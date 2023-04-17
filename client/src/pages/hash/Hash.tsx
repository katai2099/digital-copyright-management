import { useEffect, useState } from "react";
import { RadioOption } from "../../components/option/RadioOption";
import { ContentTypes } from "../../constant";
import { ContentType } from "../../model/Content";
import { ContentZoom } from "../../components/contentZoom/ContentZoom";
import { keyValuePair } from "../../utils";
import { hashDigitalContent } from "../../controllers/content";
import { UseDcm } from "../../contexts/UseDcm";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { IErrorResponse } from "../../model/Common";
import { Link } from "react-router-dom";

export const Hash = () => {
  const { dispatch } = UseDcm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<ContentType>(ContentType.IMAGE);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [errors, setErrors] = useState<keyValuePair>({});
  const [submitError, setSubmitError] = useState<IErrorResponse>({
    message: "",
    statusCode: 0,
  });
  const [uniqueContent, setUniqueContent] = useState<boolean>(false);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  function resetExistingContentError() {
    if (submitError.contentId) {
      setSubmitError({ message: "", statusCode: 0 });
    }
    if (uniqueContent) {
      setUniqueContent(false);
    }
  }

  const fileChangeHandler = () => {
    document.getElementById("uploadFile")!.click();
  };
  const selectFileHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      if (errors.file) {
        const { file, ...newErrors } = errors;
        setErrors(newErrors);
      }
      resetExistingContentError();
      setSelectedFile(event.currentTarget.files[0]);
    }
  };

  const fileTypeChangeHandler = (type: string) => {
    const contentType = type as ContentType;
    if (contentType !== fileType) {
      setFileType(contentType);
      setSelectedFile(null);
    }
    resetExistingContentError();
  };

  const acceptFileType = getAcceptFileType(fileType);

  const submitButtonClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrors({ file: "File to registered is required" });
      return;
    }
    hashDigitalContent(selectedFile, fileType, dispatch)
      .then((val) => {
        setUniqueContent(true);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.data.statusCode === 409) {
            toast.error(error.response.data.message);
            setSubmitError({
              contentId: error.response.data.contentId,
              message: error.response.data.message,
              statusCode: error.response.data.statusCode,
            });
          }
        }
      });
  };

  return (
    <div className="home-wrapper">
      <ContentZoom
        open={fullscreen}
        file={selectedFile}
        onClose={() => {
          setFullscreen(false);
        }}
        contentType={fileType}
      />

      <div className="hash-wrapper">
        <div className="content-preview-header">
          <h3>Preview</h3>
          {selectedFile && (
            <i
              className="las la-search-plus zoom-icon"
              onClick={() => {
                setFullscreen(true);
              }}
            />
          )}
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
        <div style={{ width: "100%", position: "relative" }}>
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
          {uniqueContent && (
            <div className="already-exist-content">
              File is unique. You can proceed with register your content
            </div>
          )}
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
