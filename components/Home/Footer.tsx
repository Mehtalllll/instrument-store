// components/Global/Footer.js
'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '1rem 0',
        position: 'static',
        bottom: 0,
        width: '100%',
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} Your Website. All rights reserved.
      </p>
    </footer>
  );
}
