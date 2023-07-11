import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { BookStatus, type Book } from "types";
import { getDateTimeNow } from "utils/dateUtils";

interface Props {
  submitApiHandler: (data: Book) => Promise<Response>;
}

const formFieldsConfig = {
  required: true,
};

const BookForm = ({ submitApiHandler }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentBook = (location.state || {}) as Book;

  const onSubmit: SubmitHandler<Book> = (data) => {
    data.id = currentBook.id;
    data.status ||= BookStatus.Active;
    data.editedAt = currentBook.createdAt && getDateTimeNow();
    data.createdAt ||= currentBook.createdAt || getDateTimeNow();

    submitApiHandler(data)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Wrong response from server");
        }

        navigate(`/`);
      })
      .catch((error) => console.error(error));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Book>({
    values: { ...currentBook },
  });

  return (
    <>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <div className="book-form-section">
              <label className="book-form-label">Title</label>
              <div className="col-sm-8">
                <input
                  className={
                    (errors.title ? " border-red " : "") + "form-control "
                  }
                  type="text"
                  {...register("title", {
                    ...formFieldsConfig,
                    pattern: /^(?!\s*$).+/,
                  })}
                />
              </div>
            </div>
            <div className="book-form-section">
              <label className="book-form-label">Author</label>
              <div className="col-sm-8">
                <input
                  className={
                    (errors.author ? " border-red " : "") + "form-control "
                  }
                  type="text"
                  {...register("author", {
                    ...formFieldsConfig,
                    pattern: /^(?!\s*$).+/,
                  })}
                />
              </div>
            </div>

            <div className="book-form-section">
              <label className="book-form-label">Category</label>
              <div className="col-sm-8">
                <select
                  className={
                    (errors.category ? " border-red " : "") + "form-control "
                  }
                  {...register("category", { ...formFieldsConfig })}
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Novel">Novel</option>
                  <option value="Romance">Romance</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>
            </div>

            <div className="book-form-section">
              <label className="book-form-label">ISBN</label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className={
                    (errors.isbn ? " border-red " : "") + "form-control "
                  }
                  {...register("isbn", {
                    ...formFieldsConfig,
                    min: 0,
                    pattern: /^(?!\s*$).+/,
                  })}
                />
              </div>
            </div>
            <div className="book-form-section">
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
