// components/Global/Footer.tsx
'use client';
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#222',
        color: '#fff',
        textAlign: 'center',
        padding: '3rem 1rem',
        position: 'relative',
        bottom: 0,
        width: '100%',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '2rem',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Col 1 - About Us */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>درباره ما</h3>
          <p style={{ fontSize: '1rem', maxWidth: '500px' }}>
            فروشگاه "Meh Store" یکی از برترین فروشگاه‌های آنلاین برای خرید
            سازهای موسیقی، لوازم جانبی و تجهیزات استودیو در ایران است. با سال‌ها
            تجربه در ارائه محصولات با کیفیت، هدف ما تأمین نیازهای موسیقی‌دانان
            در تمامی سطوح است.
          </p>
        </div>

        {/* Col 2 - Contact */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>تماس با ما</h3>
          <p style={{ fontSize: '1rem' }}>
            آدرس: تهران، خیابان ولیعصر، نبش خیابان حافظ، پلاک ۱۲
          </p>
          <p style={{ fontSize: '1rem' }}>
            تلفن:{' '}
            <a href="tel:+982112345678" style={{ color: '#fff' }}>
              +98 21 1234 5678
            </a>
          </p>
        </div>

        {/* Col 3 - Social Media */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '2rem',
          }}
        >
          <a
            href="https://facebook.com"
            style={{ color: '#fff' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com"
            style={{ color: '#fff' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            style={{ color: '#fff' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://youtube.com"
            style={{ color: '#fff' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
        </div>
      </div>

      <hr style={{ borderColor: '#444', margin: '2rem 0' }} />

      <p style={{ fontSize: '1rem' }}>
        &copy; {new Date().getFullYear()} Meh Store. تمام حقوق محفوظ است.
      </p>
    </footer>
  );
}
