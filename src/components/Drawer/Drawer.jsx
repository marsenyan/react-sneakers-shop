import React from 'react'
import Info from '../Info';
import axios from 'axios';
import useCart from '../../hooks/useCart';
import styles from './Drawer.module.scss'; 


const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

function Drawer({onClose, onRemove, items =[], opened})  {
  const { cartItems, setCartItems, totalPrice} = useCart();
  const [orderId, setOrderId] = React.useState(null); 
  const [isOrderComplete, setIsOrderComplete] = React.useState(false); 
  const [isLoading, setIsLoading] = React.useState(false);
  
  
 
  const onClickOrder = async () => {
    try {
      const { data } = await axios.post(`https://64522b38bce0b0a0f73e6343.mockapi.io/orders`, {
        items: cartItems,
      });
      axios.put(`https://6488a2a70e2469c038fe214d.mockapi.io/cart`,[]);
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);


      for (let i = 0; i < Array.length; i++) {
        const item = cartItems[i];
        await axios.delete(`https://6488a2a70e2469c038fe214d.mockapi.io/cart/`+ item.id);
        await delay(1000);
      }
    } catch (error) {
      alert("Error creating order :(");
    }
    setIsLoading(false);
  };

  return(
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className='d-flex justify-between mb-30'>
          Shopping Bag <img onClick={onClose} className='cu-p' src='/img/btn-remove.svg' alt='close'/>
        </h2>
        {
          items.length > 0 ? (
            <div className='d-flex flex-column flex'>
              <div className='items flex'>
          {items.map((obj) => (
              <div key={obj.id} className='cartItem d-flex align-center mb-20'>
              <div
              style={{backgroundImage:`url(${obj.imageUrl})`}}
              className='cartItemImg'></div>
  
            <div className='mr-20 flex'>
              <p className='mb-5'>{obj.title}</p>
              <b>{obj.price}$</b>
            </div>
            <img onClick={() => onRemove(obj.id)} 
             className='removeBtn' 
             src='/img/btn-remove.svg' 
             alt='remove'
            />
           </div>
          ))}
          </div>
          <div className='cartTotalBlock'>
            <ul>
              <li>
                <span>Total:</span>
                <div></div>
                <b>{totalPrice}$</b>
              </li>
              <li>
                <span>Sale tax 5%:</span>
                <div></div>
                <b>{(totalPrice / 100) * 5}$</b>
              </li>
            </ul>
            <button disabled={isLoading} onClick={onClickOrder} className='greenButton'>
              Place an order  <img src='/img/arrow.svg' alt='arrow'/>
            </button>
          </div>
            </div>
            
          ) : (
            <Info 
             title={isOrderComplete ? "Order is processed" : "Cart is empty"}
             description=
             {isOrderComplete 
               ? `Your order ${orderId} will be delivered to the courier soon` 
               : `Add a product to place an order`
             }
             image={isOrderComplete ? 'img/complete-order.jpg' : 'img/cart-empty.jpg'}
            />
          )
        }
      
      </div>
    </div>
  )
}
export default Drawer;
