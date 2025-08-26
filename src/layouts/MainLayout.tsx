import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Header from '../components/common/Header';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col  bg-black text-textPrimary">
         <Header/>

      <main className="container py-20 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};


export default MainLayout;