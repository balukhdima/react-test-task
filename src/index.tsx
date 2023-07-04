import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import {
  Dashboard,
  BookCreatePage,
  BookEditPage,
  Header,
  Footer,
} from "components";

import "./index.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books/edit" element={<BookEditPage />} />
          <Route path="/books/create" element={<BookCreatePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
