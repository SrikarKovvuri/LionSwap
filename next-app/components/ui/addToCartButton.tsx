"use client";
import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  itemId: number | string;   // allow string so we can cast
  itemName: string;
  itemPrice: number | string;
  itemImage: string;
}

export default function AddToCartButton({
  itemId,
  itemName,
  itemPrice,
  itemImage,
}: AddToCartButtonProps) {
  const addToCart = async () => {
    const body = {
      item_id: Number(itemId),
      item_name: itemName,
      item_price: Number(itemPrice),
      item_image: itemImage,
    };
    // quick client‑side validation
    if (isNaN(body.item_id) || isNaN(body.item_price)) {
      console.error("Invalid payload:", body);
      return;
    }
    console.log("Payload →", body);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/cart/add", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) alert("Successfully added to cart");
    } catch (err: any) {
      console.error("addToCart error", err.response?.data || err.message);
    }
  };

  return (
    <Button variant="outline" className="flex-1" onClick={addToCart}>
      Add to Cart
    </Button>
  );
}
