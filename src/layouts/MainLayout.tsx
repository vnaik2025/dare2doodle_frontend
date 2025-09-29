// import { Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import Header from "../components/common/Header";
// import BottomNav from "../components/common/BottomNav";
// import clsx from "clsx";

// const MainLayout = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <div className="flex flex-col h-full bg-black text-textPrimary">
//       {/* Header */}
//       <header
//         className={clsx(
//           "flex-shrink-0 px-4 border-b border-zinc-800",
//           // Mobile: 60px, Desktop: 10% height
//           "h-[60px] sm:h-[80px] md:h-[10%]"
//         )}
//       >
//         <Header />
//       </header>

//       {/* Main content */}
//       <main
//         className={clsx(
//           "overflow-y-auto",
//           {
//             // Mobile: fill remaining space minus header and footer
//             "flex-1": true,
//             // On desktop, no bottom nav, so main takes full remaining height
//             "md:h-[90%]": true,
//           }
//         )}
//       >
//         <div className="container mx-auto px-4 py-3 sm:py-5 lg:py-6 h-full">
//           <Outlet />
//         </div>
//       </main>

//       {/* Bottom nav (mobile only, visible if authenticated) */}
//       {isAuthenticated && (
//         <footer
//           className={clsx(
//             "flex-shrink-0 border-t border-zinc-800 md:hidden",
//             "h-[50px] sm:h-[60px]"
//           )}
//         >
//           <BottomNav />
//         </footer>
//       )}
//     </div>
//   );
// };

// export default MainLayout;

// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/common/Header";
import BottomNav from "../components/common/BottomNav";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { getProfile } from "../apis/usersApi";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (profile) {
      console.log("profile in mainlayout ", profile);
    }
  }, [profile]);

  const isEmailVerified = profile?.user?.isEmailVerified ?? true; // default true to avoid flashing

  return (
    <div className="flex flex-col h-full bg-black text-textPrimary">
      {/* Header */}
      <header
        className={clsx(
          "flex-shrink-0 px-4 border-b border-zinc-800",
          "h-[60px] sm:h-[80px] md:h-[10%]"
        )}
      >
        <Header />
      </header>

      {/* Tagline if not verified */}
      {isAuthenticated && !isLoading && !isEmailVerified && (
        <div className="bg-yellow-500 text-black text-center text-sm py-2">
          Please verify your email address.
          <Link to="/verify-email" className="ml-2 underline font-medium">
            Verify Now
          </Link>
        </div>
      )}

      {/* Main */}
      <main className="overflow-y-auto flex-1 md:h-[90%]">
        <div className="container mx-auto px-4 py-3 sm:py-5 lg:py-6 h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav */}
      {isAuthenticated && (
        <footer className="flex-shrink-0 border-t border-zinc-800 md:hidden h-[50px] sm:h-[60px]">
          <BottomNav />
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
