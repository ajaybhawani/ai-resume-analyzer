import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <p className=" text-gradient text-2xl font-bold">RESUMIND</p>
      </Link>
      <Link to="upload">
        <p className="primary-button w-fit">Upload Resume</p>
      </Link>
    </nav>
  );
};

export default Navbar;
