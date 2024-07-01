import React, {useState, useEffect} from 'react';
import './Order.css'

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [sorted, setSort] = useState([]);
    const [avg1, setAvg] = useState([]);

    useEffect(() => {
        fetch('/api/orders')
        .then(response => response.json())
        .then(data => setOrders(data))
        .catch(error => console.error('Error fetching orders:', error));
    }, []);

    function deleteOrder(id) {
        fetch(`/delete_order/${id}`, {
            method: 'GET',
          })
          .then(response => {
            if (response.ok) {
              // Optionally handle successful response
              console.log('Order placed successfully');
              window.location='/OrderPage';
            } else {
              // Handle errors
              console.error('Error placing order');
            }
          })
          .catch(error => {
            console.error('Error placing order:', error);
          });
    }

    const sortList = () => {
      const sortID = document.getElementById('sortID').value;
      fetch(`/sort2/${sortID}`)
      .then(response => response.json())
      .then(data => setSort(data))
      .catch(error => console.error('Error fetching sellers:', error));

      const sortID2 = document.getElementById('sortID').value;
      fetch(`/average_price/${sortID2}`)
      .then(response => response.json())
      .then(data => setAvg(data))
      .catch(error => setAvg(null));
  }

    return(
        <div className='order-page'>
            
   <body>
      <h3>Order</h3>
      <table>
         <thead>
            <th>Buyer ID</th>
            <th>Order Id</th>
            <th>Listing Id</th>
            <th>Seller Id</th>
            <th>Date Ordered</th>
         </thead>
         <tbody>
         {orders.map(order => (
                        <tr key={order.order_id}>
                        <td>{order.buyer_id}</td>
                        <td>{order.order_id}</td>
                        <td>{order.listing_id}</td>
                        <td>{order.seller_id}</td>
                        <td>{order.date_ordered}</td>
                        <button onClick={() => deleteOrder(order.order_id)}>Delete</button>                        </tr>
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
                    <th>Buyer Id</th>
                    <th>Order Id</th>
                    <th>Listing Id</th>
                    <th>Seller Id</th>
                    <th>Date Ordered</th>

                    </tr>
                </thead>

                <tbody>
                        {sorted.map(order => (
                        <tr key={order.order_id}>
                        <td>{order.buyer_id}</td>
                        <td>{order.order_id}</td>
                        <td>{order.listing_id}</td>
                        <td>{order.seller_id}</td>
                        <td>{order.date_ordered}</td>
                        </tr>
                        ))}

                    
                    
                </tbody>
                </table>

                <div>
                  <h3>Average Cost Of Orders</h3>
                  {avg1 ? avg1 : 0}
                </div>

   </body>
        </div>
    )
}

export default OrderPage;