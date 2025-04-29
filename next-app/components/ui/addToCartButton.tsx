"use client";
import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { redirect } from 'next/navigation'

interface AddToCartButtonProps {
  itemId: number | string;   // allow string so we can cast
  itemName: string;
  itemPrice: number | string;
  itemImages: string[];
  itemCategory: string;
}

export default function AddToCartButton({
  itemId,
  itemName,
  itemPrice,
  itemImages: itemImages,
  itemCategory,
}: AddToCartButtonProps) {
  const addToCart = async () => {
    const body = {
      item_id: Number(itemId),
      item_name: itemName,
      item_price: Number(itemPrice),
      item_images: itemImages,
      item_category: itemCategory
    };
    // quick client‑side validation
    if (isNaN(body.item_id) || isNaN(body.item_price)) {
      console.error("Invalid payload:", body);
      return;
    }
    console.log("Payload →", body);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://lionswap.onrender.com/cart/add", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) alert("Successfully added to cart");
    } catch (err: any) {
      redirect("/login");
      console.error("addToCart error", err.response?.data || err.message);
    }
  };

  return (
    <Button variant="outline" className="flex-1" onClick={addToCart}>
      Add to Cart
    </Button>
  );
}
