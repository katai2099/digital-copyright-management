import "./explore.css";

export const Explore = () => {
  return (
    <div className="home-wrapper">
      <div className="explore-header">
        <h3>Explore</h3>
      </div>
      <div className="explore-content-tab-wrapper">
        <div className="explore-content-tab">
          <div className="content-tab-item selected1">Image</div>
          <div className="content-tab-item">Audio</div>
          <div className="content-tab-item">Text</div>
        </div>
      </div>
      <div className="content-area">
        <div className="filter-area">
          <div className="sort-wrapper">
            <div>Sort</div>
            <div>{">"}</div>
          </div>
        </div>
        <div className="content-lists-area"></div>
      </div>
    </div>
  );
};
