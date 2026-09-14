import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <NavLink to="/feed" className="brand">
        Creator Contest
      </NavLink>

      <nav>
        {isAuthenticated ? (
          <>
            <NavLink to="/feed">Feed</NavLink>
            <NavLink to="/create-post">Create Post</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/admin/winners">Admin Winners</NavLink>
            <span className="nav-email">{user?.email}</span>
            <button type="button" className="button ghost" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
