import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './footer'
import Header from './Header/Header';
import { useAxios, DATA_URL } from './axiosHook'
import DashboardCard from './DashboardCard/DashboardCard'
import { Button, Spinner } from 'react-bootstrap'
import { FourSquare,Mosaic } from 'react-loading-indicators'
import Checkout from './Pages/Checkout/Checkout';
import { useGlobalContext } from './GlobalContext';
function App() {
  const [data, setData] = useState([])
  const [Loading, setLoading] = useState(true)
  const {addToCart, cart} = useGlobalContext();
  const axios = useAxios()

 
  useEffect(() => {
    axios.get(DATA_URL + '/products?limit=6').then((response) => {
      setData(response.data)
      for (let i = 0; i < response.data.length; i++) {
        const item = response.data[i]
        addToCart(item);
      }
      setLoading(false)
      
    });
  }, [])
  return (
    <div data-bs-theme="dark">
      <Header />
      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center',
          alignContent: 'center',
          height: '80vh',
          width: '100%',
          border: '1px solid #0f0',
          padding: '10px',
          overflowY: 'scroll'
        }}
      >
        {
          Loading && <Mosaic color="#32cd32" size="large" text="" textColor="" />
        }
        {!Loading && data.map(item => {
          return <div key={item.id}><DashboardCard item={item} /></div>
        }
        )} 
      </div> */}
      <div>
        <Checkout />
      </div>
      <Footer />
    </div>
  )
}

export default App
