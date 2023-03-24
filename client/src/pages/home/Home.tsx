import { Link } from "react-router-dom";
import { ContentItems } from "../../components/latest-content/ContentItems";
import { RadioOption } from "../../components/option/RadioOption";
import { contentFilters } from "../../constant";
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
          <Link to="/explore">
            <div className="btn-explore">Explore Contents</div>
          </Link>
        </div>
      </div>
      <div className="section-header">
        <h3>Latest Contents</h3>
        <RadioOption
          options={contentFilters}
          optionName="content-filter"
          onSelected={function (type: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
      <div className="latest-contents">
        <ContentItems />
        <ContentItems />
        <ContentItems />
      </div>
    </div>
  );
};
