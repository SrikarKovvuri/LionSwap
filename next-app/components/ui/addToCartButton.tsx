"use client"
import * as React from "react"
import axios from "axios";
import { Button } from "@/components/ui/button"

interface AddToCartButtonProps {
    itemId: number
    itemName: string
    itemPrice: number
    itemImage: string
    children?: React.ReactNode
  }

export default function AddToCartButton({ itemId, itemName, itemPrice, itemImage }: AddToCartButtonProps) {

    const addToCart = async (itemId: number, itemName: string, itemPrice: number, itemImage: string) => {
        try {
            const response = await axios.post("http://localhost:5000/add", 
                { item_id: itemId, item_name: itemName, item_price: itemPrice, item_image: itemImage },
            );
            if(response.status == 201) {
              const token = response.data.token;
              localStorage.setItem("token", token);
              alert("Sucessfully added to cart");
            }
            console.log("Response:", response);
        } catch (error) {
            console.error("Error w/ Cart API addToCart", error);
        }
    };
  
    return (
      <Button variant="outline" className="flex-1" onClick={() => addToCart(itemId, itemName, itemPrice, itemImage)}>
        Add to Cart
      </Button>
    );
  }