import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';

import Home from '../pages/Home';
import Search from '../pages/Search';
import FlightDetails from '../pages/FlightDetails';
import Checkout from '../pages/Checkout';
import Bookings from '../pages/Bookings';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'flight/:id', element: <FlightDetails /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'bookings', element: (
      <protectedRoute> 
        <Bookings/>
      </protectedRoute>) },
      { path: 'login', element: <Login /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
