import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BuyerPage from './BuyerPage';
import SellerPage from './SellerPage';
import SellPage from './SellPage';
import ListingsPage from './ListingsPage';
import OrderPage from './OrderPage';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/BuyerPage" element={<BuyerPage />} />
            <Route path="/SellerPage" element={<SellerPage />} />
            <Route path="/SellPage" element={<SellPage />} />
            <Route path="/ListingsPage" element={<ListingsPage />} />
            <Route path="/OrderPage" element={<OrderPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

const HomePage = () => {
  return (
    <div className='container'>
      <h2>Welcome!</h2>
      <p>Are you a buyer or a seller?</p>
      <div className="button-container"></div>
        <Link to="/SellerPage" className='seller-button'><button>Seller</button></Link>
        <Link to="/BuyerPage" className='buyer-button'><button>Buyer</button></Link>
      </div>
  );
};

export default App;