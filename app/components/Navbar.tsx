import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth?next=/");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-gradient text-xl sm:text-2xl font-bold">
          RESUMIND AI
        </p>
      </Link>
      <div className="flex flex-row items-center gap-2 sm:gap-3">
        <Link to="/upload">
          <p className="primary-button w-fit whitespace-nowrap">Upload Resume</p>
        </Link>
        {auth.isAuthenticated && (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-gray-200 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
