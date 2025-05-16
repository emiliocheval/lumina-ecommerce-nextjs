import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Have a question or need assistance? Our team is here to help! Reach out to us using the form below or via our contact details.
      </p>
      <form className="space-y-4 bg-muted/50 p-6 rounded-lg shadow">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Name</label>
          <input type="text" id="name" name="name" className="w-full border rounded px-3 py-2" placeholder="Your Name" required />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input type="email" id="email" name="email" className="w-full border rounded px-3 py-2" placeholder="you@email.com" required />
        </div>
        <div>
          <label htmlFor="message" className="block font-medium mb-1">Message</label>
          <textarea id="message" name="message" className="w-full border rounded px-3 py-2" rows={4} placeholder="How can we help you?" required />
        </div>
        <button type="submit" className="bg-primary text-white border border-primary px-6 py-2 rounded font-semibold hover:bg-primary/90 transition">Send Message</button>
      </form>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
        <ul className="space-y-1 text-muted-foreground">
          <li><span className="font-medium text-foreground">Email:</span> support@lumina.com</li>
          <li><span className="font-medium text-foreground">Phone:</span> +1 (555) 123-4567</li>
          <li><span className="font-medium text-foreground">Address:</span> 123 Lumina Street, Commerce City, USA</li>
        </ul>
      </div>
    </div>
  );
} 