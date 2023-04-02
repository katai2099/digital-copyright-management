import { ReactElement, ReactNode } from "react";

export interface BackdropProp {
  open: boolean;
  onClose: () => void;
  children: ReactNode | ReactElement;
  extraZ?: boolean;
}

export const Backdrop = ({ open, onClose, children, extraZ }: BackdropProp) => {
  return open ? (
    <div>
      <div
        className="backdrop"
        onClick={() => {
          onClose();
        }}
        style={extraZ ? { zIndex: 100 } : {}}
      ></div>
      <div>{children}</div>
    </div>
  ) : null;
};
