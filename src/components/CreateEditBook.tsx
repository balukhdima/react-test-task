import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

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

type Props = {
  currentBook: Book;
  // isEditing: number;
};

const CreateEditBook: React.FC<Props> = ({currentBook}) => {
  const navigate = useNavigate();
console.log(currentBook);
  const [selectedOption, setSelectedOption] = useState("");

  const handleChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

    const book = Object.fromEntries(bookData.entries());

    if (checkRequiredInputs(event)) {
      return;
    }

    book.status = "1";
    book.createdAt = getDateTimeNow();

    fetch("http://localhost:3004/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Wrong response from server");
        }
        return response.json();
      })
      .then((data) => {
        alert("New book created!");
        navigate(`/`);
      })
      .catch((error) => console.log(error));
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
                  defaultValue=""
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Category</label>
              <div className="col-sm-8">
                <select
                  className="form-control"
                  name="category"
                  value= {selectedOption}
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
                  defaultValue=""
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
}

export default CreateEditBook;
