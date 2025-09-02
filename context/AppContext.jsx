"use client";
import { productsDummyData } from "@/assets/assets";
import { serviceUrls } from "@/service/urls";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export function getHeaders(token) {
  return {
    headers: { Authorization: `Bearer ${token}` },
  }
}

export const AppContextProvider = ({ children }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const { user, isLoaded } = useUser(); // ✅ use isLoaded
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // fetch products once client-side
  useEffect(() => {
    fetchProductData();
  }, []);

  // fetch user data once Clerk is loaded
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get(serviceUrls.listProduct);
      if (data?.success) {
        setProducts(data?.body);
      } else {
        toast.error("Can't fetch products data");
      }
    } catch (error) {
      toast.error("Can't fetch products data");
      console.error(error);
    }
  };
  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();
      const { data } = await axios.get(serviceUrls.getUserData, getHeaders(token));

      if (data?.success) {
        setUserData(data?.body);
        setCartItems(data?.body?.cartItems || {});
      } else {
        toast.error("Can't fetch user data");
      }
    } catch (error) {
      toast.error("Can't fetch user data");
      console.error(error);
    }
  };

  const addToCart = async (itemId) => {
    // setCartItems((prev) => {
    //   const updated = { ...prev };
    //   updated[itemId] = (updated[itemId] || 0) + 1;
    //   return updated;
    // });
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1
    } else {
      cartData[itemId] = 1
    }
    setCartItems(cartData)
    if (user) {
      try {
        const token = await getToken();
        await axios.post(serviceUrls.updateCart, {cartData}, getHeaders(token));
        toast.success("Cart item Added")
      } catch (error) {
        toast.error(error?.message)
      }
    }

  };

  const updateCartQuantity = async (itemId, quantity) => {

    let cartData = structuredClone(cartItems);

    if (quantity == 0) {
      delete cartData[itemId]
    } else {
      cartData[itemId] = quantity
    }
    setCartItems(cartData)

    if (user) {
      try {
        const token = await getToken();
        await axios.post(serviceUrls.updateCart, {cartData}, getHeaders(token));
        toast.success("Cart item updated")
      } catch (error) {
        toast.error(error?.message)
      }
    }
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, val) => acc + val, 0);

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((acc, [id, qty]) => {
      const itemInfo = products.find((p) => p._id === id);
      return acc + (itemInfo?.offerPrice || 0) * qty;
    }, 0);

  const value = {
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData: () => setProducts(productsDummyData),
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    user,
  };

  // ✅ Prevent rendering until Clerk isLoaded
  if (!isLoaded) {
    return null; // or <div>Loading...</div>
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
