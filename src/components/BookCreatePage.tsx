import { Book } from "types";
import BookForm from "./BookForm";

const BookCreatePage = () => {
  const postBook = (book: Book) =>
    fetch(new URL("/books", process.env.REACT_APP_API_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    }).then((response) => {
      alert("Book was successfully created!");

      return response;
    });

  return <BookForm submitApiHandler={postBook} />;
};

export default BookCreatePage;
