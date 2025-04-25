"use client"
import Link from 'next/link';
import Image from 'next/image';
import axios from "axios";
import { useEffect, useState } from 'react';
import type { CartItem } from "@/lib/types";

interface RemoveFromCartProps {
    itemId: number;
}


export default function CartClient() {

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        async function fetchCartItems() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                });
                setCartItems(response.data.items);
            } catch (err: any) {
                console.log("Cart is Empty or getCartItems(TypeScript) error", err.response?.data || err.message);
            }
        }
        fetchCartItems();
    }, []);

    const handleCheckout = async() => {
        try {
            const token = localStorage.getItem("token");
            if(!token) throw new Error("Not logged in");
            const items: { title: string; price: number, sellerAccount: string } [] = [];
            for( let i = 0; i < cartItems.length; i++) {
                items.push({
                    title: cartItems[i].title,
                    price: cartItems[i].price,
                    sellerAccount: cartItems[i].sellerAccount,
                })
            }
            const response = await axios.post(
                "http://localhost:5000/create-checkout-session",
                { items },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            
              window.location.href = response.data.url;
        }
        catch(error) {
            alert("Payment could not go through. Please try again");
        }
    }

    const removeFromCart = async (itemId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:5000/cart/remove/${itemId}`, 
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
                }
            );
            console.log("Response:", response);
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error w/ Cart API removeFromCart", error);
        }
    };

    function RemoveFromCartButton({itemId}: RemoveFromCartProps) {
        return (
            <button className="text-sm text-blue-600 hover:underline mt-1" onClick={() => removeFromCart(itemId)}>
                Remove
            </button>
        );
    }


    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price), 0).toFixed(2);
    };


    return(
        <main>
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-lg text-gray-700 mb-4">Your cart is empty</p>
                <Link href="/">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium">Browse Items</span>
                </Link>
                </div>
            ) : (
                <>
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-3 text-center">Price</div>
                    </div>

                    {cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center">
                        <div className="col-span-6 flex items-center gap-4">
                        <div className="w-20 h-20 relative flex-shrink-0">
                            <Image 
                            src={item.imageUrl || "/placeholder.svg"} 
                            alt={item.title} 
                            layout="fill" 
                            objectFit="contain" 
                            />
                        </div>
                        <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <RemoveFromCartButton itemId={item.id}/>
                        </div>
                        </div>
                        
                        <div className="col-span-3 text-center">
                        <span className="md:hidden font-medium mr-2">Price:</span>
                        ${item.price.toFixed(2)}
                        </div>
                    </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow p-6 max-w-md ml-auto">
                    <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                    <span>Buyer Protection Fee</span>
                    <span>+$0.00</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                    </div>
                    <button onClick = {handleCheckout} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md font-medium">
                    Checkout
                    </button>
                    <Link href="/">
                    <span className="mt-3 block text-center text-sm text-blue-600 hover:underline">
                        Continue Shopping
                    </span>
                    </Link>
                </div>
                </>
            )}
        </main>
    )
}