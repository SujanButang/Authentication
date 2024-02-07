import { BrowserRouter } from "react-router-dom";
import Routes from "./components/Routes";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
