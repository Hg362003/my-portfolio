'use client';

import ContactIcons from '../../components/ContactIcons';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact</h1>
        <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
          Get in touch with me through email and social links.
        </p>
        <ContactIcons />
      </div>
    </div>
  );
}





