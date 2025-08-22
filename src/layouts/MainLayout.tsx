import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container flex justify-between items-center">
          {/* <h1 className="text-2xl font-bold">Dare to Doodle</h1> */}
          <nav className="space-x-4">
            <NavLink to="/" className="hover:underline">Home</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/profile" className="hover:underline">Profile</NavLink>
                <NavLink to="/bookmarks" className="hover:underline">Bookmarks</NavLink>
                <NavLink to="/notifications" className="hover:underline">Notifications</NavLink>
                <Button variant="outline" onClick={() => dispatch(logout())}>Logout</Button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <NavLink to="/login" className="hover:underline">Login</NavLink>
                <NavLink to="/register" className="hover:underline">Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-8 flex-grow"><Outlet /></main>
      
    </div>
  );
};

export default MainLayout;