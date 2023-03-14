import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { appRouter } from './App';
import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

// * all the pages
// import Home from './pages';
import Navbar from './components/Navbar';
import Error from './pages/Error';
import PendingWave from './pages/PendingWave';
import SelectAmount from './pages/SelectAmount';
import AmountToPay from './pages/AmountToPay';
import Page5 from './pages/page5';

const AppLayout = () => {
    return (
    <>
        <Navbar />
        <Outlet/>
    </>
    )
  }
  
  export const appRouter = createBrowserRouter([
      {
          path: "/",
          element: <AppLayout />,
          errorElement: <Error />, 
          children: [
              {
                  path: "/",
                  element: <App />,   
              },
              {
                path: "/pending", 
                element: <PendingWave />
              },
              {
                path: "/selectamount", 
                element: <SelectAmount />
              },
              {
                path: "/payamount", 
                element: <AmountToPay />
              },
              {
                path: "/page5", 
                element: <Page5 />
              },
          ]  
      },
  
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>  
<RouterProvider router={appRouter} />
</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
