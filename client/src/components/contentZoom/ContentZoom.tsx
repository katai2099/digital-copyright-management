import { useEffect, useState } from "react";
import { ContentType } from "../../model/Content";
import { getRequest } from "../../controllers/clientRequest";
import { IPFS_URL } from "../../constant";

interface IContentZoomProps {
  open: boolean;
  file?: File | null;
  onClose: () => void;
  contentType: ContentType;
  fileUrl?: string;
}

export const ContentZoom = ({
  open,
  file,
  onClose,
  contentType,
  fileUrl,
}: IContentZoomProps) => {
  const [fileContent, setFileContent] = useState<string>("");

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

  useEffect(() => {
    const reader = new FileReader();

    function readFile() {
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const fileContents = event.target?.result as string;
        setFileContent(fileContents);
      };
      reader.readAsText(file!);
    }
    if (file) {
      if (contentType === ContentType.TEXT) {
        readFile();
      }
    }

    if (fileUrl && contentType === ContentType.TEXT) {
      getRequest<string>(`${IPFS_URL}${fileUrl}`).then((res) => {
        setFileContent(res);
      });
    }
  }, [contentType, file, fileUrl]);

  if (!open) return null;

  return (
    <div className="backdrop" style={{ zIndex: 999 }}>
      <div className="content-zoom">
        <i
          className="lar la-times-circle close-icon"
          onClick={() => {
            onClose();
          }}
        />
        <div className="zoom-img-container">
          {contentType === ContentType.IMAGE && (
            <img
              src={file ? URL.createObjectURL(file!) : `${IPFS_URL}${fileUrl}`}
              alt=""
            />
          )}
          {contentType === ContentType.TEXT && (
            <div className="text-file-contents">{fileContent}</div>
          )}
          {contentType === ContentType.AUDIO && (
            <div className="text-file-contents">
              <audio controls>
                <source
                  src={
                    file ? URL.createObjectURL(file!) : `${IPFS_URL}${fileUrl}`
                  }
                />
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
