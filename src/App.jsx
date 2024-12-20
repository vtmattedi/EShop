import { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer/footer'
import Header from './Header/Header';
import { use } from 'react';
function App({ children }) {

  return (
    <div data-bs-theme="dark">
      {children}
      <Footer />
    </div>
  )
}

export default App
