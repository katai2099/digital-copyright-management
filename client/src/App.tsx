import "./App.css";
import { Footer } from "./components/footer/Footer";
import { Navbar } from "./components/navbar/Navbar";
import { DcmProvider } from "./contexts/DcmProvider";
import { Main } from "./pages/main/Main";

function App() {
  document.addEventListener("click", () => {
    const profileMenu = document.getElementById("profile-menu");
    profileMenu?.classList.remove("show");
  });
  return (
    <DcmProvider>
      <div className="App">
        <Navbar />
        <Main />
        <Footer />
      </div>
    </DcmProvider>
  );
}

export default App;
