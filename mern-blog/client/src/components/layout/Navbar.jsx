import { NavLink } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = false;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          MERN Blog
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            {!isLoggedIn && (
              <>
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <i className="fa-solid fa-user mx-2"></i>
                  Login
                </NavLink>
              </>
            )}
            {isLoggedIn && (
              <div className="dropdown">
                <NavLink to="/" className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fa-solid fa-user mx-2"></i>
                  USER
                </NavLink>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
