import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import UserProfile from './pages/UserProfile.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: `/user/:username`,
        element: <UserDashboard />
      },
      {
        path: `/user/profile/:username`,
        element: <UserProfile />
      }
    ],
  },
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
