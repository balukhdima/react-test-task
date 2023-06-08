import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookStatus, type Book } from "types";
import "../index.css";

interface Props {
  submitApiHandler: (data: Book) => Promise<Response>;
}

const BookForm = ({ submitApiHandler }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentBook = (location.state || {}) as Book;

  const [selectedOption, setSelectedOption] = useState("");

  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  function checkRequiredInputs(event: React.FormEvent<HTMLFormElement>) {
    const formElements = Array.from(
      event.currentTarget.elements
    ) as HTMLInputElement[];

    const hasEmptyInputs = formElements.some(
      (element) => element.required && element.value === ""
    );

    if (hasEmptyInputs) {
      formElements.forEach((element) => {
        if (element.required && element.value === "") {
          element.classList.add("border-red");
          element.placeholder = "can't be empty";
        } else {
          element.classList.remove("border-red");
        }
      });
    }

    return hasEmptyInputs;
  }

  function getDateTimeNow() {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Date().toLocaleString("en-US", options);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const bookData = new FormData(event.currentTarget);

    const book = Object.fromEntries(bookData.entries()) as any as Book;

    if (checkRequiredInputs(event)) return;

    book.id = currentBook.id;
    book.status ||= BookStatus.Active;
    book.editedAt = currentBook.createdAt && getDateTimeNow();
    book.createdAt ||= currentBook.createdAt || getDateTimeNow();

    submitApiHandler(book)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Wrong response from server");
        }

        navigate(`/`);
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={(event) => handleSubmit(event)} noValidate>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Title</label>
              <div className="col-sm-8">
                <input
                  required
                  name="title"
                  className="form-control"
                  defaultValue={currentBook.title}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Author</label>
              <div className="col-sm-8">
                <input
                  required
                  name="author"
                  className="form-control"
                  defaultValue={currentBook.author}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Category</label>
              <div className="col-sm-8">
                <select
                  className="form-control"
                  name="category"
                  value={selectedOption}
                  onChange={handleChangeCategory}
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Novel">Novel</option>
                  <option value="Romance">Romance</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">ISBN</label>
              <div className="col-sm-8">
                <input
                  required
                  type="number"
                  min={0}
                  name="isbn"
                  className="form-control"
                  defaultValue={currentBook.isbn}
                />
              </div>
            </div>

            <div className="row mb-3">
              <button type="submit" className="col-sm-2 btn btn-primary">
                Save
              </button>
              <a className="col-sm-2 btn btn-secondary" href="/">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookForm;
