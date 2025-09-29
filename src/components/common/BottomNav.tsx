// // src/components/common/BottomNav.tsx
// import { NavLink } from "react-router-dom";
// import { Home, Bookmark, Bell } from "lucide-react";

// const navItems = [
//   { to: "/", icon: <Home size={22} />, label: "Home" },
//   { to: "/bookmarks", icon: <Bookmark size={22} />, label: "Bookmarks" },
//   { to: "/notifications", icon: <Bell size={22} />, label: "Notifications" },
// ];

// const BottomNav = () => {
//   return (
//     <nav className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 z-50 md:hidden">
//       <div className="flex justify-around py-2">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             className={({ isActive }) =>
//               `flex flex-col items-center text-sm transition ${
//                 isActive ? "text-amber-400" : "text-gray-400 hover:text-white"
//               }`
//             }
//           >
//             {item.icon}
//           </NavLink>
//         ))}
//       </div>
//     </nav>
//   );
// };


import { NavLink } from "react-router-dom";
import { Home, Bookmark, Bell, Palette } from "lucide-react";

const navItems = [
  { to: "/", icon: <Home size={22} />, label: "Home" },
  { to: "/challenges", icon: <Palette size={22} />, label: "Challenges" },
  { to: "/bookmarks", icon: <Bookmark size={22} />, label: "Bookmarks" },
  { to: "/notifications", icon: <Bell size={22} />, label: "Notifications" },
];

const BottomNav = () => {
  return (
   <nav className="w-full h-full bg-black border-t border-gray-800 z-50 md:hidden">
  <div className="flex justify-around items-center h-full">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex flex-col items-center text-sm transition ${
            isActive ? "text-amber-400" : "text-gray-400 hover:text-white"
          }`
        }
      >
        {item.icon}
      </NavLink>
    ))}
  </div>
</nav>

  );
};

export default BottomNav;