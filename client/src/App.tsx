import "./App.css";
import { Navbar } from "./components/navbar/Navbar";
import { EthProvider } from "./contexts/EthProvider";
import { Main } from "./Main";

function App() {
  return (
    <EthProvider>
      <div className="App">
        <Navbar />
        <Main/>
      </div>
    </EthProvider>
  );
}

export default App;
