import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const Navbar = () => {
  const auth = useAuth();
  return (
    <div className="wrapper sticky top-0 z-10 navbar bg-base-100">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          Assistant
        </a>
      </div>

      <div className="flex-none dropdown dropdown-end">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
        <ul
          tabIndex="0"
          className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4 gap-3"
        >
          {auth?.isLoggedIn ? (
            <>
              <li>
                <Link className="" to="/chat">
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  onClick={auth.logout}
                  className="text-red-500 focus:text-red-600"
                  to="/"
                >
                  Log Out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Log In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
