import { Children, ReactElement, ReactNode } from "react";

export interface BackdropProp {
  open: boolean;
  onClose: () => void;
  children: ReactNode | ReactElement;
}

export const Backdrop = ({ open, onClose, children }: BackdropProp) => {
  return open ? (
    <div>
      <div
        className="backdrop"
        onClick={() => {
          onClose();
        }}
      ></div>
      <div>{children}</div>
    </div>
  ) : null;
};
