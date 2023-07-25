import React from 'react';
import axios from 'axios';
import Card from '../components/Card';


function Orders() {
    const [orders, setOrders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        (async () => {
          try {
            const { data } = await axios.get('https://60d62397943aa60017768e77.mockapi.io/orders');
            setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
            setIsLoading(false);
          } catch (error) {
            alert('Error when requesting orders');
          }
        })();
      }, []);

    return (
        <div className="content p-40">
          <div className="d-flex align-center justify-between mb-40">
            <h1>My orders</h1>
          </div>
    
          <div className="d-flex flex-wrap">
           {(isLoading ? [...Array(8)] : orders).map((item, index) => (
                <Card 
                 key={index} 
                 loading={isLoading}
                 {...item} 
                />
            ))}
          </div>
        </div>
    );    
}

export default Orders; 