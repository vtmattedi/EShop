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
import About from './Pages/About/About.jsx'
import Thankyou from './Pages/Thankyou/Thankyou.jsx'


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
    path: "/product/:id",
    element: <Product/>,
    errorElement: <NotFound />,
  },
  {
    path: "/about",
    element: <About/>,
    errorElement: <NotFound />,
  },
  {
    path: "/thankyou",
    element: <Thankyou/>,
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
