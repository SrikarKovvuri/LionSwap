"use client";
import * as React from "react";
import axios from "axios";

interface RemoveFromCartProps {
  itemId: number | number;
}

export default function RemoveFromCartButton({itemId}: RemoveFromCartProps) {
    const removeFromCart = async (itemId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:5000/remove/${itemId}`, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "applications/json"
                  }
                }
            );
            console.log("Response:", response);
        } catch (error) {
            console.error("Error w/ Cart API removeFromCart", error);
        }
      };
  
    return (
      <button className="text-sm text-blue-600 hover:underline mt-1" onClick={() => removeFromCart(itemId)}>
        Remove
      </button>
    );
  }
  