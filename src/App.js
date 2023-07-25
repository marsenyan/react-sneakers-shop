import './index.scss';
import React from 'react';
import Home from './pages/Home';
import Header  from './components/Header';
import Drawer from './components/Drawer/Drawer';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';



export const AppContext = React.createContext({});

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [cartOpened, setCartOpened] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() =>{
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get(`https://6488a2a70e2469c038fe214d.mockapi.io/cart`),
          axios.get(`https://64522b38bce0b0a0f73e6343.mockapi.io/favorites`),
          axios.get(`https://6488a2a70e2469c038fe214d.mockapi.io/items`),
        ])
        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Error requesting data;(');
        console.error(error);
      }
    }   
    fetchData();
  }, []);

  const onAddToCart = async (obj) =>{
    try{
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`https://6488a2a70e2469c038fe214d.mockapi.io/cart/${findItem.id}`);
    } else {
      setCartItems((prev) => [...prev, obj]);
      const { data } = await axios.post(`https://6488a2a70e2469c038fe214d.mockapi.io/cart`, obj);
      setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Error adding to cart');
      console.error(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://6488a2a70e2469c038fe214d.mockapi.io/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } catch (error) {
      alert('Error when deleting from cart');
      console.error(error);
    }
  };
  
  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`https://64522b38bce0b0a0f73e6343.mockapi.io/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
      } else {
        const { data } = await axios.post(
          'https://64522b38bce0b0a0f73e6343.mockapi.io/favorites',
          obj,
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Failed to save item");
    }
  };

  
  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };
  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  }

  return(
    <AppContext.Provider
      value={{
      items,
      cartItems,
      favorites,
      isItemAdded,
      onAddToFavorite,
      onAddToCart,
      setCartOpened,
      setCartItems,
    }}>
    <div className="wrapper clear">
      <Drawer
        items={cartItems}
        onClose={() => setCartOpened(false)}
        onRemove={onRemoveItem}
        opened={cartOpened}
      />

      <Header onClickCart={() => setCartOpened(true)} />
      <Routes>
        <Route path="/" exact
         element={
            <Home
             items={items}
             cartItems={cartItems}
             searchValue={searchValue}
             setSearchValue={setSearchValue}
             onChangeSearchInput={onChangeSearchInput}
             onAddToFavorite={onAddToFavorite}
             onAddToCart={onAddToCart}
             isLoading={isLoading}
            />
          }>
        </Route>

        <Route path="/favorites" exact 
          element={
           <Favorites />
          }>
        </Route>

        <Route path="/orders" exact 
          element={
           <Orders />
          }>
        </Route>
      </Routes>
      
    </div>
  </AppContext.Provider>
  )
  
}

export default App;
