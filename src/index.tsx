import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import DashBoard from "./components/Dashboard";
import { Header, Footer } from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateEditBook from "./components/CreateEditBook";

function App() {
  type Book = {
    id: string;
    title: string;
    author: string;
    category: string;
    isbn: number;
    createdAt: string;
    editedAt: string;
    status: string;
  };

  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    category: "",
    isbn: 0,
    createdAt: "",
    editedAt: "",
    status: "",
  });

  return (
    <>
      <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<DashBoard books = {books}  setBooks={setBooks} setCurrentBook={setCurrentBook} />} />
            <Route path="/modify" element={<CreateEditBook  currentBook = {currentBook} />} />
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
