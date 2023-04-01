import { Routes, Route } from "react-router-dom";
import { Detail } from "../detail/Detail";
import { Explore } from "../explore/Explore";
import { Home } from "../home/Home";
import { Register } from "../login/Register";
import { Profile } from "../profile/profile";
import { Launch } from "../register/Launch";
import { Setting } from "../setting/Setting";

export const Main = () => {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/content/:id" element={<Detail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile/:walletAddress" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};
