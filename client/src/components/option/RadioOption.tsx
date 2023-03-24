import { CSSProperties } from "react";
import { ContentType } from "../../model/Content";
import "./option.css";

interface IRadioOptionProps {
  options: string[];
  optionName: string;
  onSelected: (type: string) => void;
  style?: CSSProperties;
}

export const RadioOption = ({
  options,
  optionName,
  onSelected,
  style,
}: IRadioOptionProps) => {
  const optionChangeHandler = (event: React.MouseEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    const type = event.currentTarget.value as ContentType;
    onSelected(type);
  };

  return (
    <div className="radio-options" style={style && style}>
      {options.map((option, i) => (
        <div>
          <input
            id={option}
            className="radio-option"
            type="radio"
            value={option}
            name={optionName}
            defaultChecked={i === 0 ? true : false}
            onClick={optionChangeHandler}
          />
          <label className="radio-option-label" htmlFor={option}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};
