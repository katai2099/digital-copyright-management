import "./App.css";
import { Footer } from "./components/footer/Footer";
import { Navbar } from "./components/navbar/Navbar";
import { EthProvider } from "./contexts/EthProvider";
import { Main } from "./pages/main/Main";

function App() {
  return (
    // <EthProvider>
    <div className="App">
      <Navbar />
      <Main />
      <Footer />
    </div>
    // </EthProvider>
  );
}

export default App;
