import { Accordion } from "../accordion/Accordion";
import "./filterArea.css";

export const FilterArea = () => {
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
        {/* <Accordion title="Sort"> */}
        <div className="dropdown-header">
          <button className="drop-button" onClick={handleDropdownClicked}>
            Created: Newest
          </button>
          <div id="dropdown-items" className="dropdown-contents">
            <a href="#">Created: Newest</a>
            <a href="#">Created: Oldest</a>
            <a href="#">Price: Highest</a>
            <a href="#">Price: Lowest</a>
          </div>
        </div>
        {/* </Accordion> */}
      </div>
    </div>
  );
};
