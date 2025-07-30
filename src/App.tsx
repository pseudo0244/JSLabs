import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PDFMaker from './pages/PDFMaker';
import Finance from './pages/Finance';
import Billing from './pages/Billing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdf-maker" element={<PDFMaker />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </Router>
  );
}

export default App;
