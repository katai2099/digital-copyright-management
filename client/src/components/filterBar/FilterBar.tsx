import { ContentWithIcon } from "../../constant";
import { ContentType } from "../../model/Content";
import "./filterBar.css";

interface IFilterBarProps {
  options: ContentWithIcon[];
  inputName: string;
  onClicked: (type: string) => void;
}

export const FilterBar = ({
  options,
  inputName,
  onClicked,
}: IFilterBarProps) => {
  const optionChangedHandler = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    onClicked(event.currentTarget.value);
  };

  return (
    <div className="filter-wrapper">
      <div className="filters">
        {options.map((options, i) => (
          <div>
            <input
              id={options.value}
              type="radio"
              value={options.value}
              defaultChecked={i === 0 ? true : false}
              name={inputName}
              onClick={optionChangedHandler}
            />
            <div className="filter-option">
              <i className={options.icon}></i>
              <label htmlFor={options.value}>{options.value}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
