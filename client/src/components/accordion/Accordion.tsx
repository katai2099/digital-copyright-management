import { ReactElement, ReactNode } from "react";
import "./accordion.css";

interface IAccordionProps {
  children: ReactNode | ReactElement;
  title: string;
}

export const Accordion = ({ children, title }: IAccordionProps) => {
  const accordionClickHandler = () => {
    const accordion = document.getElementById(`dcm-accordion-button${title}`);
    accordion?.classList.toggle("active");
    const accordionBody = document.getElementById(`accordion-body${title}`);
    accordionBody?.classList.toggle("show");
  };
  return (
    <div>
      <button
        id={`dcm-accordion-button${title}`}
        className="dcm-accordion"
        onClick={accordionClickHandler}
      >
        {title}
      </button>
      <div id={`accordion-body${title}`} className="dcm-accordion-item-body">
        {children}
      </div>
    </div>
  );
};
