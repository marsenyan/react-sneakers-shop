import { AppContext } from "../App";
import React from "react";


const useCart = () => {
    const {cartItems, setCartItems} = React.useContext(AppContext);
    const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);

    return { cartItems, setCartItems, totalPrice}; 
}

export default useCart; 
