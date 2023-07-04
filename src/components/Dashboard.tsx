import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type Book, BookStatus } from "types";
import { serialize } from "v8";

const UndefinedStatus = "Undefined Status";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    BookStatus | typeof UndefinedStatus
  >(BookStatus.Active);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  const [searchInput, setSearchinput] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);


  function handlerSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchinput(e.target.value);
    searchBooks();
  }

  function searchBooks () {
    if(searchInput.length > 0) {
      setFilteredBooks(books.filter(book => book.title.toLowerCase().includes(searchInput.toLowerCase())));
      return;
    }
    setFilteredBooks(books);
  }


  const fetchBooks = useCallback(
    (status: BookStatus | typeof UndefinedStatus) => {
      const url = new URL("/books", process.env.REACT_APP_API_URL);

      status !== UndefinedStatus && url.searchParams.set("status", status);

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Wrong response from server");
          }
          return response.json();
        })
        .then((data) => {
          setFilteredCount(data.length);

          setBooks(data);
          setFilteredBooks(data);
        })
        .catch((error) => console.error(error));
    },
    []
  );

  function filterBooks(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.currentTarget.value as BookStatus;
    setSelectedStatus(selectedValue);

    fetchBooks(selectedValue);
  }

  function handleActivation(book: Book) {
    const updatedData = {
      ...book,
      status:
        book.status === BookStatus.Active
          ? BookStatus.Deactivated
          : BookStatus.Active,
    };

    fetch(`${process.env.REACT_APP_API_URL}/books/` + book.id, {
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
        fetchBooks(selectedStatus);
      })
      .catch((error) => console.error(error));
  }

  function handleDelete(id: string) {
    fetch(`${process.env.REACT_APP_API_URL}/books/` + id, {
      method: "DELETE",
    })
      .then(() => {
        fetchBooks(selectedStatus);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => fetchBooks(selectedStatus), [fetchBooks, selectedStatus]);

  useEffect(() => searchBooks(), [searchInput]);

  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-center mb-3">List of books</h2>
      <div className="d-flex justify-content-center">
        <Link className="btn btn-primary m-2" to="/books/create">
          Add Book
        </Link>
      </div>

      <div className="d-flex justify-content-center">
        <select value={selectedStatus} onChange={filterBooks}>
          <option value={BookStatus.Active}>Show Active</option>
          <option value={BookStatus.Deactivated}>Show Deactivated</option>
          <option value={UndefinedStatus}>Show All</option>
        </select>
        <span className="px-3">{filteredCount} rows</span>
        <input
        type="text"
        onChange={handlerSearchInput}
        value={searchInput}
        />
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
          {filteredBooks.map((book, index) => {
            function navigateToEditPage() {
              navigate("/books/edit", { state: book });
            }

            return (
              <tr key={index}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.isbn}</td>
                <td>{book.createdAt}</td>
                <td>{book.editedAt === "" ? "-" : book.editedAt}</td>
                <td>
                  <button
                    className="btn btn-primary m-2"
                    onClick={navigateToEditPage}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary m-2"
                    onClick={() => handleActivation(book)}
                  >
                    {book.status === BookStatus.Deactivated
                      ? "Re-activate"
                      : "Deactivate"}
                  </button>
                  {book.status === BookStatus.Deactivated ? (
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
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Dashboard;
