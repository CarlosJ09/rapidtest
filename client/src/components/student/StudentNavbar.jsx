import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useSesion from "../../hooks/useSession";
import Avatar from "../../assets/avatar.jpg";

function StudentNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [session] = useSesion();

  const avatarMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleAvatarMenu = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };

  const closeMenus = (event) => {
    if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
      setIsAvatarMenuOpen(false);
    }

    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
    setIsAvatarMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", closeMenus);

    return () => {
      document.removeEventListener("click", closeMenus);
    };
  }, []);

  return (
    <nav className="w-screen h-16 flex flex-row justify-between items-center px-8 bg-primary text-white z-50">
      <div className="w-40 text-xl font-bold mr-8">Rapid Test</div>

      <button
        className="block md:hidden text-white"
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div
        className={`absolute top-16 left-0 w-full bg-primary md:static md:flex md:flex-row md:justify-between md:items-center ${
          isMenuOpen ? "block" : "hidden"
        }`}
        ref={mobileMenuRef}
      >
        <ul className="flex flex-col md:flex-row justify-center gap-6 md:gap-10 p-4 md:p-0">
          <li className="block md:hidden hover:underline font-semibold border-b pb-4">
            <Link to="/student/profile" onClick={handleNavigation}>
              Student - {session?.user?.username}
            </Link>
          </li>
          <li className="block md:hidden hover:underline">
            <Link to="/student/saved" onClick={handleNavigation}>
              Saved
            </Link>
          </li>
          <li className="hover:underline cursor-pointer">
            <Link to="/student" onClick={handleNavigation}>
              Explore
            </Link>
          </li>
          <li className="hover:underline cursor-pointer">
            <Link to="/student/history" onClick={handleNavigation}>
              History
            </Link>
          </li>
          <li className="block md:hidden hover:underline">
            <Link to="/logout" onClick={handleNavigation}>
              Logout
            </Link>
          </li>
        </ul>

        <div className="hidden md:flex justify-center md:justify-end items-center gap-6 p-4 md:p-0 relative">
          <span className="font-semibold">Welcome, {session?.user?.username}</span>
          <div className="relative" ref={avatarMenuRef}>
            <img
              className="rounded-full h-10 w-10 cursor-pointer"
              src={Avatar}
              alt="Avatar"
              onClick={toggleAvatarMenu}
            />
            {isAvatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-md z-10">
                <ul className="flex flex-col">
                  <Link to="/student/profile" onClick={handleNavigation}>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded-t-lg">Profile</li>
                  </Link>
                  <Link to="/student/saved" onClick={handleNavigation}>
                    <li className="px-4 py-2 hover:bg-gray-100">Saved</li>
                  </Link>
                  <Link to="/logout" onClick={handleNavigation}>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded-b-lg">Logout</li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentNavbar;
