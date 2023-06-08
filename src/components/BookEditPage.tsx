import { Book } from "types";
import BookForm from "./BookForm";

const BookEditPage = () => {
  const putBook = (book: Book) => {
    return fetch(new URL(`/books/${book.id}`, process.env.REACT_APP_API_URL), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    }).then((response) => {
      alert("Book was successfully edited!");

      return response;
    });
  };

  return <BookForm submitApiHandler={putBook} />;
};

export default BookEditPage;
