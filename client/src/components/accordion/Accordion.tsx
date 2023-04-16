import { ReactElement, ReactNode, useState } from "react";
import "./accordion.css";

interface IAccordionProps {
  children: ReactNode | ReactElement;
  title: string;
  isOpen?: boolean;
}

export const Accordion = ({
  children,
  title,
  isOpen = false,
}: IAccordionProps) => {
  const [open, setOpen] = useState<boolean>(isOpen);
  const accordionClickHandler = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <button
        id={`dcm-accordion-button${title}`}
        className={`dcm-accordion ${open ? "active" : ""}`}
        onClick={accordionClickHandler}
      >
        {title}
      </button>
      <div
        id={`accordion-body${title}`}
        className={`dcm-accordion-item-body ${open ? "show" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};
