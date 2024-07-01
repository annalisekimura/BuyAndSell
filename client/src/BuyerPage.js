import React, {useState, useEffect} from 'react';
import './Buyer.css'
import { useNavigate } from 'react-router-dom';

/* Lists all the buyers and allows you to add a new buyer */

const BuyerPage = () => {
    const navigate = useNavigate();
    const [buyers, setBuyers] = useState([]);

    // fetches the buyers from the database

    useEffect(() => {
        fetch('/api/buyers')
        .then(response => response.json())
        .then(data => setBuyers(data))
        .catch(error => console.error('Error fetching buyers:', error));
        console.log(buyers);
    }, []);

    return (
        <div className='buyer-page'>
          <button className='back-btn' onClick={() => navigate('/')}>Back</button>
          <h1>Buyers</h1>
          <table className='buyer-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Number</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map(buyer => (
                <tr key={buyer.id}>
                  <td>{buyer.id}</td>
                  <td>{buyer.first_name}</td>
                  <td>{buyer.last_name}</td>
                  <td>{buyer.age}</td>
                  <td><a href="/ListingsPage" type="button" className='browse-link'>Browse</a></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Don't see your ID? Create one!</h2>
        
            <div className='add-buyer-form'>
                <form action="/add" method="POST">
                    <label>Name</label>
                    <input type="text" name="first_name" placeholder="name..."></input>
                    <label>Email</label>
                    <input type="text" name= "last_name" placeholder="email..."></input>
                    <label>Phone Number</label>
                    <input type="number" name="age" placeholder="phone number..."></input>

                    <button type="submit">Add</button>
                </form>
            </div>

        </div>
      );
    
}

export default BuyerPage;