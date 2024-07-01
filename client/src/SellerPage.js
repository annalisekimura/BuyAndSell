import React, {useState, useEffect} from 'react';
import './Seller.css'
import { useNavigate } from 'react-router-dom';

/* Lists all sellers and allows you to add a seller */

const SellerPage = () => {
    const navigate = useNavigate();
    const [sellers, setSellers] = useState([]);

    // fetches all sellers

    useEffect(() => {
        fetch('/api/sellers')
        .then(response => response.json())
        .then(data => setSellers(data))
        .catch(error => console.error('Error fetching sellers:', error));
    }, []);

    return (
      <div className='seller-page'>
        <button className='back-btn' onClick={() => navigate('/')}>Back</button>
        <h1>Sellers</h1>
        <table className='seller-table'>
          <thead>
            <tr >
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map(seller => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.first_name}</td>
                <td>{seller.last_name}</td>
                <td>{seller.age}</td>
                <td><a href="/SellPage" type="button">Sell</a></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Don't see your ID? Create one!</h2>
        <form className='formDes' action="/add2" method="POST">
          <label>Name</label>
          <input type="text" name="first_name2" placeholder="name..."></input>
          <label>Email</label>
          <input type="text" name= "last_name2" placeholder="email..."></input>
          <label>Phone Number</label>
          <input type="number" name="age2" placeholder="phone number..."></input>
          <button type="submit">Add</button>
        </form>
      </div>
    );
}

export default SellerPage;