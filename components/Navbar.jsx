"use client";

import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, useUser, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { serviceUrls } from "@/service/urls";

const Navbar = () => {
  const router = useRouter();
  const { isSeller } = useAppContext() || {};
  const { openSignIn } = useClerk();
  const { isLoaded, user } = useUser(); // ✅ get user safely
  const { getToken } = useAuth();

  const fetchUserData = async () => {
      try {
        if (user?.publicMetadata?.role === "seller") {
        }
  
        const token = await getToken();
        const { data } = await axios.get(serviceUrls.getUserData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (data?.success) {
        } else {
          toast.error("Can't fetch user data");
        }
      } catch (error) {
        toast.error("Can't fetch user data");
        console.error(error);
      }
    };
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      {/* Logo */}
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
        width={120}
        height={40} // ✅ always specify width/height
      />

      {/* Desktop menu */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Desktop right actions */}
      <ul className="hidden md:flex items-center gap-4">
        <Image
          className="w-4 h-4"
          src={assets.search_icon}
          alt="search icon"
          width={16}
          height={16}
        />
        <ButtonWithSign isLoaded={isLoaded} user={user} router={router} openSignIn={openSignIn} />
      </ul>

      {/* Mobile right actions */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        <ButtonWithSign isLoaded={isLoaded} user={user} router={router} openSignIn={openSignIn} />
      </div>
    </nav>
  );
};

export default Navbar;

const ButtonWithSign = ({ isLoaded, user, router, openSignIn }) => {
  // ✅ Don't render anything until Clerk has loaded
  if (!isLoaded) return null;

  if (user) {
    return (
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action
            label="Home"
            labelIcon={<HomeIcon />}
            onClick={() => router.push("/")}
          />
          <UserButton.Action
            label="Products"
            labelIcon={<BoxIcon />}
            onClick={() => router.push("/all-products")}
          />
          <UserButton.Action
            label="Cart"
            labelIcon={<CartIcon />}
            onClick={() => router.push("/cart")}
          />
          <UserButton.Action
            label="My Orders"
            labelIcon={<BagIcon />}
            onClick={() => router.push("/my-orders")}
          />
        </UserButton.MenuItems>
      </UserButton>
    );
  }

  return (
    <button
      onClick={() => openSignIn?.()}
      className="flex items-center gap-2 hover:text-gray-900 transition"
    >
      <Image
        src={assets.user_icon}
        alt="user icon"
        width={20}
        height={20}
      />
      Account
    </button>
  );
};
