import { useState } from "react";
import "./launch.css";

export const Launch = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const handleFileChange = () => {
    document.getElementById("uploadFile")!.click();
  };
  const selectFileHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      setSelectedFile(event.currentTarget.files[0]);
    }
  };
  return (
    <div className="home-wrapper">
      <div className="launch-form-area">
        <div className="content-upload-area">
          <div className="content-display-container" onClick={handleFileChange}>
            <img
              src={
                selectedFile == null
                  ? "./img/icons8-upload-100.png"
                  : URL.createObjectURL(selectedFile)
              }
              id="displayContent"
              alt="content"
            />
            <div>Select files</div>
          </div>
          <input
            hidden={true}
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            id="uploadFile"
            onChange={selectFileHandler}
          />
        </div>
        <div className="information-area">
          <form className="information-form">
            <label className="input-label">Title</label>
            <input type="text" />
            <label className="input-label">Owner</label>
            <input type="text" />
            <label className="input-label">Email</label>
            <input type="email" />
            <label className="input-label">Description</label>
            <textarea />
            <label className="input-label">Price Options</label>
            <div className="pricing-option-wrapper">
              <div className="pricing-option selected">One time used</div>
              <input className="price" />
            </div>
            <div className="pricing-option-wrapper">
              <div className="pricing-option ">Monthly</div>
              <input className="price" />
            </div>
            <label className="input-label">Pricing information</label>
            <textarea />
          </form>
        </div>
      </div>
    </div>
  );
};
