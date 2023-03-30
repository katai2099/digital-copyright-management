import { ReactElement, ReactNode } from "react";
import { Backdrop, BackdropProp } from "./Backdrop";

interface IModal {
  title: string;
  hasFooter?: boolean;
  confirmTitle?: string;
  children: ReactNode | ReactElement;
  onConfirm?: () => void;
}

export const Modal = (props: IModal & BackdropProp) => {
  return (
    <Backdrop open={props.open} onClose={props.onClose}>
      <div
        className="dcm-modal-box"
        tabIndex={1}
        style={{ margin: "1.75rem auto" }}
      >
        <div className="app-card">
          <div className="dcm-modal-header">
            <h2>{props.title}</h2>
            <button onClick={props.onClose}>Close</button>
          </div>
          <div className="dcm-modal-body">{props.children}</div>
          <div className="dcm-modal-footer">
            <button onClick={props.onClose}>Close</button>
            <button onClick={props.onConfirm}>{props.confirmTitle}</button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};
