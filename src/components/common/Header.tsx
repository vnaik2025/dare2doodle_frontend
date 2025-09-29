// src/components/common/Header.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../apis/usersApi";
import Avatar from "../common/Avatar";
import { User, LogOut, Home, Bookmark, Bell, Palette } from "lucide-react";
import logo from '../../../public/logo2.png'

interface HeaderProps {
  showAuthLinks?: boolean;
}

const navItems = [
  { to: "/", icon: <Home size={18} />, label: "Home" },
  { to: "/challenges", icon: <Palette size={18} />, label: "Challenges" },
  { to: "/bookmarks", icon: <Bookmark size={18} />, label: "Bookmarks" },
  { to: "/notifications", icon: <Bell size={18} />, label: "Notifications" },
];

const Header = ({ showAuthLinks = true }: HeaderProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return (
   <header className="w-full h-full bg-black border-b border-gray-800 text-white shadow-md">

      <div className="container mx-auto flex justify-between items-center py-3 px-2">
        {/* Logo */}
        <img src={logo} alt="logo"
          onClick={() => navigate("/")}
          className=" w-50 h-6 text-xl md:text-2xl font-bold cursor-pointer tracking-wide hover:text-amber-400 transition"
        />
         
       

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-1 transition ${
                  isActive ? "text-amber-400" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="relative flex items-center gap-3">
          {!isAuthenticated && showAuthLinks && (
            <div className="space-x-4 text-sm font-medium">
              <NavLink to="/login" className="hover:text-amber-400 transition">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="hover:text-amber-400 transition"
              >
                Register
              </NavLink>
            </div>
          )}

          {isAuthenticated && (
            <>
              {isLoading && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-700 text-gray-400">
                  ...
                </div>
              )}

              {isError && (
                <div className="text-xs text-red-400">Failed to load</div>
              )}

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
