import { useEffect, useState } from "react";
import { ContentType } from "../../model/Content";

interface IContentZoomProps {
  file: File | null;
  onClose: () => void;
  contentType: ContentType;
}

export const ContentZoom = ({
  file,
  onClose,
  contentType,
}: IContentZoomProps) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc, false);
    return () => {
      document.removeEventListener("keydown", handleEsc, false);
    };
  }, [onClose]);

  const [fileContent, setFileContent] = useState<string>("");
  const reader = new FileReader();
  function readFile() {
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const fileContents = event.target?.result as string;
      setFileContent(fileContents);
    };
    reader.readAsText(file!);
  }

  if (contentType === ContentType.TEXT) {
    readFile();
  }

  return (
    <div className="backdrop" style={{ zIndex: 999 }}>
      <div className="content-zoom">
        <i
          className="lar la-times-circle close-icon"
          onClick={() => {
            onClose();
          }}
        ></i>
        <div className="zoom-img-container">
          {contentType === ContentType.IMAGE && (
            <img src={URL.createObjectURL(file!)} alt="" />
          )}
          {contentType === ContentType.TEXT && (
            <div className="text-file-contents">{fileContent}</div>
          )}
          {contentType === ContentType.AUDIO && (
            <div className="text-file-contents">
              <audio controls>
                <source src={URL.createObjectURL(file!)} />
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
