import { Link } from "react-router-dom";
//import { UseEth } from "../../contexts/UseEth";
import "./navbar.css";

export const Navbar = () => {
  //onst { state } = UseEth();
  return (
    <nav className="nav-bar">
      <div className="left-area">
        <Link className="" to="/" style={{ textDecoration: "none" }}>
          <div className="logo navbar-brand">
            <span style={{ marginLeft: "15px" }}>
              <img src="./img/icons8-cubes-64.png" alt="logo" />
            </span>
            <div style={{ color: "white" }}>
              Copyright <br />
              Management
            </div>
          </div>
        </Link>
        <div className="search-bar">
          <input
            className="search-box"
            type="search"
            placeholder="Search for titles or usernames"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="right-area">
        <div className="menu-items">
          <a href="#">
            <div className="menu-item">Explore</div>
          </a>
          <a href="#">
            <div className="menu-item">Launch</div>
          </a>
        </div>
        {/* <div className="menu-items-mobile"></div> */}
        <div className="btn-connect">Connect</div>
      </div>
    </nav>
  );
};
