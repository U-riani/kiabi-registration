import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TermsAndConditions from "./pages/TermsAndConditions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
    </Routes>
  );
}

export default App;
