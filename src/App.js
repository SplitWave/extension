// import logo from './logo.svg';
import './App.css';
import Home from './pages/index';
import ReactDOM from 'react-dom/client';
import React from 'react';

// * For Routing
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

// * all the pages
import Navbar from './components/Navbar';
import Error from './pages/Error';
import PendingWave from './pages/PendingWave';
import SelectAmount from './pages/SelectAmount';
import AmountToPay from './pages/AmountToPay';
import Page5 from './pages/page5';

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}
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
                element: <Home />,   
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


export default App;
