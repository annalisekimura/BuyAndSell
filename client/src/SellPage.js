import React, {useState, useEffect} from 'react';
import './SellerList.css';

const SellPage = () => {

    const [listings, setListings] = useState([]);
    const [sorted, setSort] = useState([]);
    const [edited, setEdit] = useState([])

    useEffect(() => {
        fetch(`/api/listings`)
        .then(response => response.json())
        .then(data => setListings(data))
        .catch(error => console.error('Error fetching listings:', error));
    }, []);

    const sortList = () => {
        const sortID = document.getElementById('sortID').value;
        fetch(`/sort/${sortID}`)
        .then(response => response.json())
        .then(data => setSort(data))
        .catch(error => console.error('Error fetching sellers:', error));
    }

    const editList = () => {
        const editID = document.getElementById('editID').value;
        fetch(`/edit/${editID}`)
        .then(response => response.json())
        .then(data => setEdit(data))
        .catch(error => console.error('Error fetching sellers:', error));
    }

    function deleteListing(id) {
        fetch(`/delete_listing/${id}`, {
            method: 'GET',
          })
          .then(response => {
            if (response.ok) {
              // Optionally handle successful response
              console.log('Order placed successfully');
              window.location='/SellPage';
            } else {
              // Handle errors
              console.error('Error placing order');
            }
          })
          .catch(error => {
            console.error('Error placing order:', error);
          });
    }

    const saveChanges = () => {
        const id = document.getElementById('editID').value;
        const max_quantity = document.getElementById('max_quantity').value;
        const ppu = document.getElementById('ppu').value;
        const location = document.getElementById('location').value;

        fetch(`/save_changes/${id}/${max_quantity}/${ppu}/${location}`, {
            method: 'GET',
          })
          .then(response => {
            if (response.ok) {
              // Optionally handle successful response
              console.log('Order placed successfully');
              window.location='/SellPage';
            } else {
              // Handle errors
              console.error('Error placing order');
            }
          })
          .catch(error => {
            console.error('Error placing order:', error);
          });
    }



    return (
        <div className='sell-page'>
      <title>Listing Page</title>
        <body>
            <h3>Listings</h3>


            <br></br>
            <table>
                <thead>
                    <tr>
                    <th>Listing Id</th>
                    <th>Seller Id</th>
                    <th>Max Quantity</th>
                    <th>Price Per Unit</th>
                    <th>Location</th>

                    </tr>
                </thead>

                <tbody>
                {listings.map(listing => (
                        <tr key={listing.listing_id}>
                        <td>{listing.listing_id}</td>
                        <td>{listing.seller_id}</td>
                        <td>{listing.max_quantity}</td>
                        <td>{listing.ppu}</td>
                        <td>{listing.location}</td>
                        </tr>
                    ))}

                    
                </tbody>
            </table>
            <br></br>

            <form onSubmit={event => event.preventDefault()}>
                <label>Sort by ID</label>
                <input type="number" id="sortID" placeholder="id"></input>
                <button type="submit" onClick={sortList}>Enter</button>
                
            </form>


            <table>
                <thead>
                    <tr>
                    <th>Listing Id</th>
                    <th>Seller Id</th>
                    <th>Max Quantity</th>
                    <th>Price Per Unit</th>
                    <th>Location</th>

                    </tr>
                </thead>

                <tbody>
                        {sorted.map(listing => (
                        <tr key={listing.listing_id}>
                        <td>{listing.listing_id}</td>
                        <td>{listing.seller_id}</td>
                        <td>{listing.max_quantity}</td>
                        <td>{listing.ppu}</td>
                        <td>{listing.location}</td>
                        <button onClick={() => deleteListing(listing.listing_id)}>Delete</button>
                        </tr>
                        ))}

                    
                    
                </tbody>
                </table>
                
                <br></br>
                <form onSubmit={event => event.preventDefault()}>
                <label>Edit Listing</label>
                <input type="number" id="editID" placeholder="id"></input>
                <button type="submit" onClick={editList}>Enter</button>
                
            </form>

                <table>

                <tbody>
                {edited.map(listing => (
                    
                        <tr key={listing.listing_id}>
                        <td>{listing.listing_id}</td>
                        <td>{listing.seller_id}</td>
                        <input type="number" id="max_quantity" placeholder={listing.max_quantity}></input>
                        <input type="number" id="ppu" placeholder={listing.ppu}></input>
                        <input type="text" id="location" placeholder={listing.location}></input>
                        <button type="submit" onClick={saveChanges}>Save</button>
                        </tr>
                    ))}

                    
                </tbody>
            </table>




      <h3>Listing Form</h3>
      <form action="/add4" method="POST">
         <label>Seller ID</label>
         <input type="number" name="seller_id" placeholder="id..."></input>
         <label>Max Quantity</label>
         <input type="number" name="max_quantity" placeholder="quantity..."></input>
         <label>Price Per Unit</label>
         <input type="number" name="ppu" placeholder="price..."></input>
         <label>Location</label>
         <input type="text" name="location" placeholder="location..."></input>
         
         <button type="submit">Add</button>
      </form>

        </body>
   </div>
      );
    
}

export default SellPage;