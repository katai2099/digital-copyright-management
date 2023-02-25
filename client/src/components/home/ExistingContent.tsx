import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyrightImage } from "../../model/CopyrightImage";
import { ContentDetail } from "../blocklist/ContentDetail";
import { Backdrop } from "../common/Backdrop";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

interface ExistingContentProps {
  copyrightImage: CopyrightImage;
  onConfirm: () => void;
}

export const ExistingContent = (props: ExistingContentProps) => {
  const { copyrightImage } = props;

  return (
    <div>
      <Backdrop onClick={()=>props.onConfirm()}/>
      <div className="modal-box">
        <div className="app-card">
          <button className="btn-corner" onClick={()=>props.onConfirm()}>
            <span >
              <FontAwesomeIcon icon={faTimesCircle} />{" "}
            </span>
          </button>
          <ContentDetail
            copyrightImage={copyrightImage}
            displayButton={false}
            />
        </div>
      </div>
    </div>
  );
};


