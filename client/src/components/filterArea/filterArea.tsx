import { useState } from "react";
import { FilterValue, SortType } from "../../model/Common";
import "./filterArea.css";

export interface IFilterAreaProps {
  onSelected: (sort: SortType) => void;
}

export const FilterArea = ({ onSelected }: IFilterAreaProps) => {
  //!IMPORTANT navigate("../login",{replace: true})
  //to replace current router path

  const [sortBy, setSortBy] = useState<FilterValue>(FilterValue.LATEST);
  const handleSortClicked = () => {
    const accordion = document.getElementById("accordion-id");
    accordion?.classList.toggle("active");
    const dropdownContainer = document.getElementById("filter-body");
    dropdownContainer?.classList.toggle("show");

    const dropdownItemContainer = document.getElementById("dropdown-items");
    if (dropdownItemContainer?.classList.contains("show")) {
      dropdownItemContainer?.classList.toggle("show");
    }
  };
  const handleDropdownClicked = () => {
    const dropdownItemContainer = document.getElementById("dropdown-items");
    dropdownItemContainer?.classList.toggle("show");
  };

  const sortChangeHandler = (event: React.MouseEvent<HTMLInputElement>) => {
    const filterValue = event.currentTarget.value;
    onSelected(filterValue.split(":")[1].trim() as SortType);
    setSortBy(event.currentTarget.value as FilterValue.LATEST);
    const dropdownItemContainer = document.getElementById("dropdown-items");
    dropdownItemContainer?.classList.toggle("show");
  };

  return (
    <div className="filter-header">
      <button
        id="accordion-id"
        className="accordion"
        onClick={handleSortClicked}
      >
        Sort
      </button>
      <div id="filter-body" className="filter-item-body">
        <div className="dropdown-header">
          <button className="drop-button" onClick={handleDropdownClicked}>
            {sortBy}
          </button>
          <div id="dropdown-items" className="dropdown-contents">
            <div className="sort-item">
              <input
                className="sort-radio"
                type="radio"
                id={FilterValue.LATEST}
                value={FilterValue.LATEST}
                name="sort"
                onClick={sortChangeHandler}
                defaultChecked
              />
              <label htmlFor={FilterValue.LATEST}>{FilterValue.LATEST}</label>
            </div>
            <div className="sort-item">
              <input
                className="sort-radio"
                type="radio"
                id={FilterValue.OLDEST}
                value={FilterValue.OLDEST}
                name="sort"
                onClick={sortChangeHandler}
              />
              <label htmlFor={FilterValue.OLDEST}>{FilterValue.OLDEST}</label>
            </div>
            <div className="sort-item">
              <input
                className="sort-radio"
                type="radio"
                id={FilterValue.HIGHEST}
                value={FilterValue.HIGHEST}
                name="sort"
                onClick={sortChangeHandler}
              />
              <label htmlFor={FilterValue.HIGHEST}>{FilterValue.HIGHEST}</label>
            </div>
            <div className="sort-item">
              <input
                className="sort-radio"
                type="radio"
                id={FilterValue.LOWEST}
                value={FilterValue.LOWEST}
                name="sort"
                onClick={sortChangeHandler}
              />
              <label htmlFor={FilterValue.LOWEST}>{FilterValue.LOWEST}</label>
            </div>
            {/* <a href="#">Created: Newest</a>
            <a href="#">Created: Oldest</a>
            <a href="#">Price: Highest</a>
            <a href="#">Price: Lowest</a> */}
          </div>
        </div>
        {/* </Accordion> */}
      </div>
    </div>
  );
};
