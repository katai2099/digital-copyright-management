import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UseDcm } from "../../contexts/UseDcm";
import { connectMetamask, disconnectMetamask } from "../../controllers/web3";
import "./navbar.css";

export const Navbar = () => {
  const { state, dispatch } = UseDcm();
  const navigate = useNavigate();
  const handleConnectButtonClick = () => {
    connectMetamask(dispatch);
  };

  const handlerLogoutClick = () => {
    disconnectMetamask(dispatch);
  };

  const profileClickHandler = () => {
    const profileMenu = document.getElementById("profile-menu");
    profileMenu?.classList.toggle("show");
  };

  return (
    <nav className="nav-bar">
      <div className="left-area">
        <Link className="" to="/" style={{ textDecoration: "none" }}>
          <div className="logo navbar-brand">
            <span style={{ marginLeft: "15px" }}>
              <i
                className="las la-cubes"
                style={{ fontSize: "56px", color: "#88a9ea" }}
              ></i>
            </span>
            <div style={{ color: "#88a9ea" }}>
              Copyright <br />
              Management
            </div>
          </div>
        </Link>
        <div className="search-bar">
          <div className="search-icon">
            <i>
              <FontAwesomeIcon icon={faSearch} />
            </i>
          </div>
          <input
            className="search-input"
            type="search"
            placeholder="Search for titles or usernames"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="right-area">
        <div className="menu-items">
          <Link to="/explore">
            <div className="menu-item">Explore</div>
          </Link>
          <Link to="/launch">
            <div className="menu-item">Launch</div>
          </Link>
        </div>
        {/* <div className="menu-items-mobile"></div> */}
        {/* {state.accounts.length === 0 && (
          <button className="btn-connect" onClick={handleConnectButtonClick}>
            Connect
          </button>
        )} */}
        {
          <div id="profile-area" className="profile-area">
            <div onClick={profileClickHandler}>
              <img src="../../img/cookie.jpg" className="profile-img"></img>
            </div>
            <div id="profile-menu" className="profile-menu">
              <div
                className="profile-area-button"
                onClick={() => {
                  profileClickHandler();
                  navigate("/profile");
                }}
              >
                <i className="las la-photo-video profile-logo"></i>
                Content
              </div>
              <div
                className="profile-area-button"
                onClick={() => {
                  profileClickHandler();
                  navigate("/setting");
                }}
              >
                <i className="las la-cog profile-logo"></i>
                Settings
              </div>
              <div className="profile-area-button" onClick={handlerLogoutClick}>
                <i className="las la-sign-out-alt profile-logo"></i>
                Logout
              </div>
              <hr className="profile-menu-divider" />
              <div
                className="profile-fund"
                onClick={() => {
                  profileClickHandler();
                  navigate("/profile");
                }}
              >
                <i className="las la-wallet"></i>
                <div className="wallet-info">
                  <div className="wallet-address">
                    1231fasdxasdfasdfasdfasdfasdfasdfasdfasdfassadfasdf
                  </div>
                  <div className="wallet">
                    <i>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="price-ether-icon"
                      >
                        <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                      </svg>
                    </i>{" "}
                    <div>100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </nav>
  );
};
