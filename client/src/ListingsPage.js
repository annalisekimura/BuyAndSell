import React, {useState, useEffect} from 'react';
import './Listings.css'
import { useNavigate } from 'react-router-dom';

/* Shows all the listings from the sellers that the buyers are able to buy */
const ListingsPage = () => {
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);

    // fetch listings from the database

    useEffect(() => {
        fetch('/api/listings')
        .then(response => response.json())
        .then(data => setListings(data))
        .catch(error => console.error('Error fetching listings:', error));
    }, []);

    return(
      <div className='listings-page'>
        <button className='back-btn' onClick={() => navigate('/BuyerPage')}>Back</button>
        <head>
          <title>View Listings</title>
        </head>
        <body>
          <h3>Listings</h3>
          <br></br>
          <table className='listHead'>
            <thead>
                <th>Listing Id</th>
                <th>Seller Id</th>
                <th>Max Quantity</th>
                <th>Price Per Unit</th>
                <th>Location</th>
                <th>Buyer ID</th>
            </thead>
            <tbody>
                {listings.map(listing => (
                    <tr key={listing.listing_id}>
                        <td>{listing.listing_id}</td>
                        <td>{listing.seller_id}</td>
                        <td>{listing.max_quantity}</td>
                        <td>{listing.ppu}</td>
                        <td>{listing.location}</td>
                        <td>
                          <form method="POST" action={`/buy/${listing.listing_id}`}>
                            <input type="number" name="buyer_id" placeholder='Buyer ID' required></input>
                              <button type="submit">Buy</button>
                          </form>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </body>
      </div>
    )
}

export default ListingsPage;