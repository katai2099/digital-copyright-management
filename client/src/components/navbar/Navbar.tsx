import { Link } from "react-router-dom";
import { UseEth } from "../../contexts/UseEth";

export const Navbar = () => {
  const { state } = UseEth();
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark justify-content-between">
      <Link className="navbar-brand" to="/">
        <span style={{ marginLeft: "15px", marginRight: "20px" }}>
          <img src="./img/icons8-cubes-64.png" alt="logo" />
        </span>
        Copyright Management
      </Link>
      { state.accounts.length >0 && 
        <div>
          <p className="text-center text-light">Active account : {state.accounts[0]}</p>
        </div>
      }
      <div className="d-inline-flex">
        <Link
          className="btn btn-sm outline-light ms-2 me-2 btn-light"
          to="/blockList"
        >
          SHOW ALL BLOCKS
        </Link>
        <Link className="btn btn-sm outline-light ms-2 me-2 btn-light" to="/">
          UPLOAD A NEW IMAGE
        </Link>
      </div>
    </nav>
  );
};
