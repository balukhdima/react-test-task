import "../index.css";
export function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom box-shadow py-3 mb-3">
      <div className="container">
        <a className="navbar-brand" href="/">
          Demo Book List
        </a>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="container p-3 mt-5 border-top d-flex justify-content-center">
        <a className="nav-link" href="https://github.com/balukhdima" target="_blank">
          GitHub Link
        </a>
      </div>
    </footer>
  );
}
