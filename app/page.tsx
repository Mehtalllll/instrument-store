'use client';
import Example from '@/components/Edite-modal';
import Navbar from '@/components/Navbar';
import React from 'react';

export default function Home() {
  const [open, setopen] = React.useState<boolean>(false);
  return (
    <>
      <Navbar />
      <button onClick={() => setopen(!open)}>dasda</button>
      {open && <Example />}
    </>
  );
}
