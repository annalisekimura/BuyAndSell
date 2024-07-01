import React, {useState, useEffect} from 'react';
import './Listings.css'

const ListingsPage = () => {

    const [listings, setListings] = useState([]);

    useEffect(() => {
        fetch('/api/listings')
        .then(response => response.json())
        .then(data => setListings(data))
        .catch(error => console.error('Error fetching listings:', error));
    }, []);

    return(
        <div className='listings-page'>
        <head>
      <title>View Listings</title>
   </head>
   <body>
      <h3>Listings</h3>
      <br></br>
      <table>
         <thead>
            <th>Listing Id</th>
            <th>Seller Id</th>
            <th>Max Quantity</th>
            <th>Price Per Unit</th>
            <th>Location</th>
            <th>Buyer ID</th>
            <th>#</th>
            
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