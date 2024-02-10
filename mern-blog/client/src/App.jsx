import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Fragment, Suspense } from "react";

import Root from "./components/layout/Root";
import Public from "./components/layout/Public";
import Private from "./components/layout/Private";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <div className="container my-5">500 Internal Server Error</div>,
      children: [
        {
          path: "/",
          index: true,
          element: (
            <Fragment>
              <Suspense fallback={<p className="text-center">Loading...</p>}>
                <h1>Hello World</h1>
              </Suspense>
            </Fragment>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <Private>
              <h1>Dashboard Page</h1>
            </Private>
          ),
        },
        {
          path: "/dashboard/blog",
          element: (
            <Private>
              <h1>Create New Blog Page</h1>
            </Private>
          ),
        },
        {
          path: "/dashboard/blog/:id",
          element: (
            <Private>
              <h1>Edit Blog Page</h1>
            </Private>
          ),
        },
        {
          path: "/login",
          element: (
            <Public>
              <h1>Login Page</h1>
            </Public>
          ),
        },
        {
          path: "/register",
          element: (
            <Public>
              <h1>Register Page</h1>
            </Public>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
