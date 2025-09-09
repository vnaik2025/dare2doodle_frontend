import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../apis/usersApi";
import Avatar from "../common/Avatar";
import {
  Home,
  Bookmark,
  Bell,
  LogOut,
  User,
} from "lucide-react";

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
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: false,
  });

  return (
    <header className="fixed top-0 left-0 w-full bg-black backdrop-blur-md border-b border-gray-800 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl md:text-2xl font-bold cursor-pointer tracking-wide hover:text-amber-400 transition"
        >
          Dare2Doodle
        </h1>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium relative">
            {[
              { to: "/", label: "Home", icon: <Home size={18} /> },
              { to: "/bookmarks", label: "Bookmarks", icon: <Bookmark size={18} /> },
              { to: "/notifications", label: "Notifications", icon: <Bell size={18} /> },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-1 transition relative group`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-1 text-gray-400 group-hover:text-white transition">
                      {link.icon}
                      <span className="hidden md:inline">{link.label}</span>
                    </div>
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-[-6px] h-[2px] rounded-full bg-amber-400 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="relative flex items-center gap-3">
          {!isAuthenticated && showAuthLinks && (
            <div className="space-x-4 text-sm font-medium">
              <NavLink to="/login" className="hover:text-amber-400 transition">
                Login
              </NavLink>
              <NavLink to="/register" className="hover:text-amber-400 transition">
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
                <div className="text-xs text-red-400">Failed to load profile</div>
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
                    <div className="absolute right-0 top-12 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg py-2 text-sm z-50 animate-fadeIn">
                      <button
                        onClick={() => {
                          navigate(`/profile/${profile?.user?.$id}`);
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md transition"
                      >
                        <User size={16} /> Profile
                      </button>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md text-red-400 transition"
                      >
                        <LogOut size={16} /> Logout
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
