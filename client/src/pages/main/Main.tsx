import { Routes, Route } from "react-router-dom";
import { Blocklist } from "../../components/blocklist/Blocklist";
// import { Home } from "../../components/home/Home2";
// import { UseEth } from "../../contexts/UseEth";
import { Detail } from "../detail/Detail";
import { Explore } from "../explore/Explore";
import { Home } from "../home/Home";
import { Profile } from "../profile/profile";
import { Launch } from "../register/Launch";
import { Setting } from "../setting/Setting";

export const Main = () => {
  // const { state } = UseEth();
  return (
    <div className="main-content">
      {/* {state.web3 != null &&
      state.accounts.length !== 0 &&
      state.contract != null ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blockList" element={<Blocklist />} />
        </Routes>
      ) : (
        <div className="wait">
          <img src="./img/blockchain.png" id="wait" alt="Waiting...." />
          <br />
          <br />
          <h4>Waiting to connect to blockchain and metamask</h4>
        </div>
      )} */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/content" element={<Detail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </div>
  );
};
