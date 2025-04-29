// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer(){
  return (
    <footer className="bg-[#1e2756] text-white py-12 px-4">
      <div className="container mx-auto flex flex-wrap justify-center md:justify-between gap-12">
        {/* SUPPORT Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium mb-3">SUPPORT</h2>
          <Link href="/contact" className="hover:underline">Contact Us</Link>
          <Link href="/contact" className="hover:underline">Buyer Protection</Link>
          <Link href="/contact" className="hover:underline">Seller Protection</Link>
          <Link href="/contact" className="hover:underline">Refunds and Returns</Link>
        </div>

        {/* POLICIES Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium mb-3">POLICIES</h2>
          <Link href="/policy-center" className="hover:underline">Policy Center</Link>
        </div>
      </div>
    </footer>
  );
};