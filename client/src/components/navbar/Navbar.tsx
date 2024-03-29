import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { userActions } from "../../contexts/state";
import { UseDcm } from "../../contexts/UseDcm";
import {
  disconnectMetamask,
  navbarLogin,
  startLogin,
} from "../../controllers/web3";
import "./navbar.css";
import { DcmSearch } from "../dcmSearch/DcmSearch";
import { generateRandomLinearGradient } from "../../utils";

export const Navbar = () => {
  const { state, dispatch } = UseDcm();
  const [remainingBalance, setRemainingBalance] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (state.web3State.account !== "") {
      state.web3State.web3?.eth
        .getBalance(state.web3State.account)
        .then((balance) => {
          const etherBalance = state.web3State.web3?.utils.fromWei(
            balance,
            "ether"
          );
          setRemainingBalance(etherBalance!.substring(0, 5));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [
    remainingBalance,
    state.user.walletAddress,
    state.web3State.account,
    state.web3State.web3?.eth,
    state.web3State.web3?.utils,
  ]);

  const handleConnectButtonClick = async () => {
    // connectMetamask(dispatch);
    setIsOpen(false);

    navbarLogin(dispatch)
      .then((user) => {
        dispatch({ type: userActions.create, data: user });
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            navigate("/register");
          }
        }
      });
  };

  const handlerLogoutClick = () => {
    disconnectMetamask(dispatch, state);
  };

  const profileClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(false);

    const profileMenu = document.getElementById("profile-menu");
    profileMenu?.classList.toggle("show");
    event.stopPropagation();
  };

  const navRoutes = [
    "/launch",
    "/content/",
    "/explore",
    "/profile/",
    "/settings",
    "/hash",
  ];

  const showNavBar =
    location.pathname === "/" ||
    navRoutes.some((route) => location.pathname.includes(route));

  return showNavBar ? (
    <nav className="">
      {isOpen && (
        <div
          className="backdrop"
          onClick={() => {
            setIsOpen(false);
          }}
        />
      )}
      <div className="nav-bar">
        <div className="left-area">
          <Link
            className=""
            to="/"
            style={{ textDecoration: "none" }}
            onClick={() => {
              setIsOpen(false);
            }}
          >
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
          <DcmSearch
            backdropActive={isOpen}
            onSearch={(value: boolean) => {
              setIsOpen(value);
            }}
          />
        </div>

        <div className="right-area">
          <div className="menu-items">
            <Link
              to="/explore"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <div className="menu-item">Explore</div>
            </Link>
            <Link to="/hash" onClick={() => setIsOpen(false)}>
              <div className="menu-item">Hash</div>
            </Link>
            {state.user.walletAddress !== "" && (
              <Link
                to="/launch"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <div className="menu-item">Launch</div>
              </Link>
            )}
          </div>
          {state.web3State.account === "" ? (
            <button className="btn-connect" onClick={handleConnectButtonClick}>
              Connect
            </button>
          ) : (
            <div id="profile-area" className="profile-area">
              <div
                id="profile-nav"
                onClick={(event) => profileClickHandler(event)}
              >
                <img
                  style={
                    state.user.walletAddress !==
                    "0xA90D7fB9CfdF1c33C0bC0bE58605C4f2Bfc40972"
                      ? { background: generateRandomLinearGradient() }
                      : {}
                  }
                  src="../../img/cookie.jpg"
                  className="profile-img"
                  alt=""
                />
              </div>
              <div id="profile-menu" className="profile-menu">
                <div
                  className="profile-area-button"
                  onClick={() => {
                    navigate(`/profile/${state.web3State.account}`);
                  }}
                >
                  <i className="las la-user profile-logo"></i>
                  {state.user.firstname + " " + state.user.lastname}
                </div>
                <div
                  className="profile-area-button"
                  onClick={() => {
                    navigate("/settings");
                  }}
                >
                  <i className="las la-cog profile-logo"></i>
                  Management
                </div>
                <div
                  className="profile-area-button"
                  onClick={handlerLogoutClick}
                >
                  <i className="las la-sign-out-alt profile-logo"></i>
                  Logout
                </div>
                <hr className="profile-menu-divider" />
                <div className="profile-fund">
                  <i className="las la-wallet"></i>
                  <div className="wallet-info">
                    <div className="wallet-address">
                      {state.web3State.account}
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
                      <div>{remainingBalance}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  ) : (
    <nav className="">
      <div className="nav-bar">
        <div className="left-area">
          <Link
            className=""
            to="/"
            style={{ textDecoration: "none" }}
            onClick={() => {
              setIsOpen(false);
            }}
          >
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
        </div>
      </div>
    </nav>
  );
};
