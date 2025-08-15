import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import FilteredDataTable from "./components/FilteredData";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center">
      <Header />
      <div className="w-full flex pt-20 pb-16">
        <Router>
          <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/filteredData" element={<FilteredDataTable />} />
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
