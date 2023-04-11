import { Routes, Route } from "react-router-dom";
import { Detail } from "../detail/Detail";
import { Explore } from "../explore/Explore";
import { Home } from "../home/Home";
import { Register } from "../register/Register";
import { Profile } from "../profile/profile";
import { Launch } from "../launch/Launch";
import { Setting } from "../setting/Setting";
import { LoadingScreen } from "../../components/loadingScreen/LoadingScreen";
import { UseDcm } from "../../contexts/UseDcm";
import { ToastContainer } from "react-toastify";
import { Hash } from "../hash/Hash";

export const Main = () => {
  const { state } = UseDcm();
  return (
    <div className="main-content">
      {state.loadingState.loading && (
        <LoadingScreen title={state.loadingState.loadingText} />
      )}
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        autoClose={3000}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/hash" element={<Hash />} />
        <Route path="/content/:id" element={<Detail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile/:walletAddress" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </div>
  );
};
