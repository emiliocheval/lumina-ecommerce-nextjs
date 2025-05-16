import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        Welcome to Lumina, your destination for premium products and a modern shopping experience. Our mission is to bring you the best in quality, style, and innovation, all in one place.
      </p>
      <p className="mb-4">
        Founded in 2024, Lumina was created by a team of passionate individuals who believe shopping should be inspiring, easy, and enjoyable. We carefully curate our collections to ensure every product meets our high standards for excellence.
      </p>
      <p className="mb-4">
        We are committed to providing exceptional customer service and a seamless online experience. Whether you are looking for the latest trends or timeless classics, Lumina is here to help you shine.
      </p>
      <p className="mb-4">
        Thank you for choosing Lumina. We look forward to being a part of your journey.
      </p>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Our Values</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Quality products, carefully curated</li>
          <li>Customer-first service</li>
          <li>Modern, seamless shopping experience</li>
          <li>Innovation and inspiration</li>
        </ul>
      </div>
    </div>
  );
} 