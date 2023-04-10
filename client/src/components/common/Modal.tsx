import { ReactElement, ReactNode } from "react";
import { Backdrop, BackdropProp } from "./Backdrop";

interface IModal {
  title: string;
  hasFooter?: boolean;
  confirmTitle?: string;
  closeTitle?: string;
  children: ReactNode | ReactElement;
  onConfirm?: () => void;
  onXMarkClose?: () => void;
}

export const Modal = (props: IModal & BackdropProp) => {
  return (
    <Backdrop
      open={props.open}
      onClose={props.onClose}
      extraZ={props.extraZ ? props.extraZ : false}
    >
      <div
        className="dcm-modal-box"
        tabIndex={1}
        style={{ margin: "1.75rem auto" }}
      >
        <div className="app-card">
          <div className="dcm-modal-header">
            <h1 className="modal-title fs-5 ps-4">{props.title}</h1>
            <button
              className="btn-close"
              onClick={props.onXMarkClose ? props.onXMarkClose : props.onClose}
            ></button>
          </div>
          <div className="dcm-modal-body">{props.children}</div>
          <div className="dcm-modal-footer">
            <button className="btn btn-secondary" onClick={props.onClose}>
              {props.closeTitle ? props.closeTitle : "Close"}
            </button>
            <button className="btn btn-primary" onClick={props.onConfirm}>
              {props.confirmTitle}
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

interface RequestInfoModalProps {
  onReasonChange: (reason: string) => void;
  onFieldOfUseChange: (field: string) => void;
  isError: boolean;
}

export const RequestInfoModal = (props: RequestInfoModalProps) => {
  return (
    <div className="detail-page-modal px-4">
      <legend className="w-auto mb-2">Request info</legend>
      <label>Reason of use*</label>
      <textarea
        className={props.isError ? "textarea-error" : ""}
        rows={3}
        placeholder="purpose of using content"
        onChange={(event) => props.onReasonChange(event.currentTarget.value)}
      />
      {props.isError && (
        <div className="errorText">Please enter reason of use!</div>
      )}
      <label style={{ marginTop: "10px" }}>Field of use</label>
      <textarea
        placeholder="Usually define the scope of license covered and its restriction"
        rows={6}
        onChange={(event) =>
          props.onFieldOfUseChange(event.currentTarget.value)
        }
      />
      <small className="py-2">
        If left empty then owner field of use will be used
      </small>
    </div>
  );
};
