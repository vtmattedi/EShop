import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { GlobalProvider } from './GlobalContext.jsx'
import App from './App.jsx'
import Checkout from './Pages/Checkout/Checkout.jsx'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import NotFound from './Pages/Notfound/Notfound.jsx'
import Product from './Pages/Products/Product.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <NotFound />,
  },
  {
    path: "/checkout",
    element: < Checkout />,
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <NotFound />,
  },
  {
    path: "/products",
    element: <Product/>,
    errorElement: <NotFound />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },

]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
      <App>
        <RouterProvider router={router} />
      </App>
    </GlobalProvider>
  </StrictMode>,
);
