// pages/privacy-center.tsx
import Head from 'next/head';
import React from 'react';

export default function PolicyCenter() {
  return (
    <>
      <Head>
        <title>Privacy Center | Your Platform</title>
        <meta name="description" content="Privacy and protection policies for our platform." />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#1e2756] text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Privacy Center</h1>
            <p className="mt-2 text-gray-300">
              Learn how we protect your information and transactions
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">

            {/* Privacy Policy */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e2756] mb-2">Privacy Policy</h2>
              <p className="text-gray-500 mb-6">Last Updated: April 26, 2025</p>
              <p className="text-gray-700 mb-4">
                Welcome to our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
              </p>
              <p className="text-gray-700">
                We are committed to protecting your personal information and your right to privacy.
              </p>
            </div>

            {/* Buyer Protection */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e2756] mb-2">Buyer Protection Policy</h2>
              <p className="text-gray-500 mb-6">Last Updated: April 26, 2025</p>
              <p className="text-gray-700 mb-4">
                Our Buyer Protection Policy ensures a safe and secure shopping experience. 
                We offer full or partial refunds if you don't receive your item or it’s not as described.
              </p>
              <p className="text-gray-700">
                To qualify, maintain an account in good standing and report issues promptly.
              </p>
            </div>

            {/* Seller Protection */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e2756] mb-2">Seller Protection Policy</h2>
              <p className="text-gray-500 mb-6">Last Updated: April 26, 2025</p>
              <p className="text-gray-700 mb-4">
                Our Seller Protection Policy helps protect sellers from fraudulent claims and chargebacks. 
                To be eligible, sellers must ship items with tracking and respond to buyer inquiries in a timely manner.
              </p>
              <p className="text-gray-700">
                We are here to support your business growth with fair resolutions.
              </p>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
