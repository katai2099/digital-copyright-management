import { ReactElement, ReactNode } from "react";
import "./card.css";

interface ICardProps {
  children: ReactNode | ReactElement;
}

export const Card = ({ children }: ICardProps) => {
  return <div className="dcm-card">{children}</div>;
};
