import { useEffect, useState } from "react";
import { RadioOption } from "../../components/option/RadioOption";
import { ContentTypes } from "../../constant";
import { ContentType } from "../../model/Content";

export const Hash = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<ContentType>(ContentType.IMAGE);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const fileChangeHandler = () => {
    document.getElementById("uploadFile")!.click();
  };
  const selectFileHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      //   if (errors.file) {
      //     const { file, ...newErrors } = errors;
      //     setErrors(newErrors);
      //   }
      setSelectedFile(event.currentTarget.files[0]);
    }
  };

  const fileTypeChangeHandler = (type: string) => {
    // console.log(state.user);
    const contentType = type as ContentType;
    if (contentType !== fileType) {
      setFileType(contentType);
      setSelectedFile(null);
    }
  };

  const acceptFileType = getAcceptFileType(fileType);

  return (
    <div className="home-wrapper">
      <div className="hash-wrapper">
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
        {/* {errors.file && (
    <div className="error-text" style={{ paddingLeft: "16px" }}>
      {errors.file}
    </div>
  )} */}
        <div style={{ width: "100%", position: "relative" }}>
          <button className="submit-button" onClick={() => {}}>
            Submit
          </button>
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
