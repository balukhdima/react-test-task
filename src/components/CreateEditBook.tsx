import React from "react";
import { useNavigate } from "react-router-dom";

function CreateEditBook() {
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const bookData = new FormData(event.currentTarget);

    const book = Object.fromEntries(bookData.entries());

    if (!book.title || !book.author || !book.category || !book.isbn) {
      console.log("not all fields filled");
      return;
    }

    // const options = {
    //   day: 'numeric',
    //   month: 'long',
    //   year: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   hour12: true
    // };

    // const date = new Date();
    // book.createdAt = date.toLocaleString('en-US', options);
    // book.editedAt = "2023-07-07";

    book.status = "1";

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
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Title</label>
              <div className="col-sm-8">
                <input
                  required
                  name="title"
                  className="form-control"
                  defaultValue=""
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
                <input
                  required
                  name="category"
                  className="form-control"
                  defaultValue=""
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">ISBN</label>
              <div className="col-sm-8">
                <input
                  required
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
