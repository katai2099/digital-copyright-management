import { ContentItems } from "../../components/latest-content/ContentItems";
import "./home.css";

export const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="hero-box">
        <div className="slogan-area">
          <h3 className="slogan-title">
            Decentralized Copyright Management Platfrom
          </h3>
          <p className="slogan-detail">
            A platform for register digital content and manage subscription with
            no intermediary
          </p>
          <a href="#">
            <div className="btn-explore">Explore Contents</div>
          </a>
        </div>
      </div>
      <div className="section-header">
        <div>Latest Contents</div>
        <div className="filter-selection">
          <div className="filter selected">All</div>
          <div className="filter">Img</div>
          <div className="filter">Audio</div>
          <div className="filter">Text</div>
        </div>
      </div>
      <div className="latest-contents">
        <ContentItems />
        <ContentItems />
        <ContentItems />
      </div>
      <div style={{ backgroundColor: "black" }}>
        <a href="#">
          <div className="btn-explore">Explore More Contents</div>
        </a>
      </div>
    </div>
  );
};
