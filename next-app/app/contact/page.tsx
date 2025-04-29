import React from 'react';

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-2">
        📧 Email us at:
      </p>
      <div className="flex flex-col space-y-2 text-center">
        <a href="mailto:srikarkovvuri5@gmail.com" className="text-blue-600 hover:underline">
          srikarkovvuri5@gmail.com
        </a>
        <a href="mailto:davidxionghl@gmail.com" className="text-blue-600 hover:underline">
          davidxionghl@gmail.com
        </a>
        <a href="mailto:bhavyanshsabharwal@gmail.com" className="text-blue-600 hover:underline">
          bhavyanshsabharwal@gmail.com
        </a>
      </div>
    </div>
  );
}
