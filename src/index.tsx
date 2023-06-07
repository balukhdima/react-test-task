import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import DashBoard from "./components/Dashboard";
import { Header, Footer } from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateEditBook from "./components/CreateEditBook";
import { booksContext } from "./contexts/BooksContext";

function App() {
  // type Book = {
  //   title: string;
  //   author: string;
  //   category: string;
  //   isbn: string;
  // };
  // const [books, setBooks] = useState<Book[]>([]);
  return (
    <>
      <BrowserRouter>
        {/* <booksContext.Provider value={{books, setBooks}}> */}
          <Header />
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/modify" element={<CreateEditBook />} />
          </Routes>
          <Footer />
        {/* </booksContext.Provider> */}
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
