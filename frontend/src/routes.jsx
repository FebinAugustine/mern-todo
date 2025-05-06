import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import App from "./App";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <AuthRedirect>
              <Home />
            </AuthRedirect>
          ),
        },
        {
          path: "login",
          element: (
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          ),
        },
        {
          path: "register",
          element: (
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          ),
        },
        {
          path: "dashboard",
          element: <ProtectedRoute />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
          ],
        },
        {
          path: "profile",
          element: <ProtectedRoute />,
          children: [
            {
              index: true,
              element: <ProfilePage />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL || "/",
  }
);

export default router;
