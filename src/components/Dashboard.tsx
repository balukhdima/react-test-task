import React, { useState, useEffect, useContext } from "react";
import { booksContext } from "../contexts/BooksContext";

function DashBoard() {
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
  const [selectedStatus, setSelectedStatus] = useState<string>("0");
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [booksCount, setBooksCount] = useState<number>(0);

  // const {books, setBooks} = useContext<{books: Book, setBooks: React.Dispatch<React.SetStateAction<Book[]>>}>(booksContext);
  function fetchBooks() {
    fetch("http://localhost:3004/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Wrong response from server");
        }
        return response.json();
      })
      .then((data) => {
        setFilteredCount(data.length);
        setBooksCount(data.length);
        setBooks(data);
      })
      .catch((error) => console.log(error));
  }

  function fetchFilteredBooks(status: string) {
    fetch("http://localhost:3004/books?status=" + status)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Wrong response from server");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setFilteredCount(data.length);
      })
      .catch((error) => console.log(error));
  }

  function filterBooks(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.currentTarget.value;
    setSelectedStatus(selectedValue);

    if (selectedValue === "2") {
      fetchBooks();
    } else {
      fetchFilteredBooks(selectedValue);
    }
  }

  useEffect(() => fetchBooks(), []);

  function handleActivation(book: Book) {
    const updatedData = {
      ...book,
      status: book.status === "1" ? "0" : "1",
    };

    fetch("http://localhost:3004/books/" + book.id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating field");
        }
        alert(
          "Book has been" + updatedData.status === "0"
            ? "re-activated"
            : "deactivated"
        );
        fetchBooks();
      })
      .catch((error) => console.log(error));
  }

  function handleDelete(id: string) {
    fetch("http://localhost:3004/books/" + id, {
      method: "DELETE",
    })
      .then((response) => {
        fetchBooks();
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <h2 className="text-center mb-3">List of books</h2>
      <div className="d-flex justify-content-center">
        <a className="btn btn-primary m-2" href="/modify">
          Add Book
        </a>
      </div>

      <div className="d-flex justify-content-center">
        <select value={selectedStatus} onChange={filterBooks}>
          <option value="0">Show Active</option>
          <option value="1">Show Deactivated</option>
          <option value="2">Show All</option>
        </select>
        <span className="px-3">
          {filteredCount} / {booksCount}
        </span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Book title</th>
            <th>Author name</th>
            <th>Category</th>
            <th>ISBN</th>
            <th>Created At</th>
            <th>Edited At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.isbn}</td>
              <td>{book.createdAt}</td>
              <td>{book.editedAt == "" ? "-" : book.editedAt}</td>
              <td>
                <a className="btn btn-primary m-2" href="/modify">
                  Edit
                </a>
                <button
                  className="btn btn-secondary m-2"
                  onClick={() => handleActivation(book)}
                >
                  {book.status === "0" ? "Re-activate" : "Deactivate"}
                </button>
                {book.status === "0" ? (
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="btn btn-danger m-2"
                  >
                    Delete
                  </button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default DashBoard;
