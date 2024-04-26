import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from "./components/Navigation/Navigation-bonus";
import * as sessionActions from "./store/session";
import { Modal } from "./context/Modal";
import Spots from "./components/Spots";
import SpotShow from "./components/SpotShow";
import NewSpotForm from "./components/NewSpotForm/NewSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateSpotForm from "./components/UpdateSpotForm";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Modal />
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Spots />,
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotShow />,
      },
      {
        path: "/spots/new",
        element: <NewSpotForm />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <UpdateSpotForm />,
      },
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
