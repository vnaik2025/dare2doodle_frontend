import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../apis/usersApi";
import Avatar from "../common/Avatar";

interface HeaderProps {
  showAuthLinks?: boolean;
}

const Header = ({ showAuthLinks = true }: HeaderProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Profile query with caching
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
    cacheTime: 1000 * 60 * 30, // 30 minutes - keep in cache
    retry: false, // don’t retry on error like 401
  });

  return (
    <header className="fixed top-0 left-0 w-full bg-black backdrop-blur-md border-b border-gray-800 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl md:text-2xl font-bold cursor-pointer tracking-wide hover:text-primary transition"
        >
          D2D
        </h1>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <NavLink to="/" className="hover:text-primary transition">
            Home
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/bookmarks" className="hover:text-primary transition">
                Bookmarks
              </NavLink>
              <NavLink
                to="/notifications"
                className="hover:text-primary transition"
              >
                Notifications
              </NavLink>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="relative">
          {!isAuthenticated && showAuthLinks && (
            <div className="space-x-4 text-sm font-medium">
              <NavLink to="/login" className="hover:text-primary transition">
                Login
              </NavLink>
              <NavLink to="/register" className="hover:text-primary transition">
                Register
              </NavLink>
            </div>
          )}

          {isAuthenticated && (
            <>
              {/* Show loader while fetching */}
              {isLoading && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs border border-gray-700 text-gray-400">
                  ...
                </div>
              )}

              {/* Show error state */}
              {isError && (
                <div className="text-xs text-red-400">
                  Failed to load profile
                </div>
              )}

              {/* Once profile is loaded */}
              {profile && (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full border border-gray-700 overflow-hidden shadow-md hover:scale-105 transition"
                  >
                    <Avatar name={profile?.user?.username} size={40} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg py-2 text-sm z-50 animate-fadeIn">
                      <button
                        onClick={() => {
                          navigate(`/profile/${profile?.user?.$id}`);
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md transition"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md text-red-400 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
