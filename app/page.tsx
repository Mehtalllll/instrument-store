'use client';
import Example from '@/components/Global/Edite-modal';
import Navbar from '@/components/Global/Navbar';
import React from 'react';

export default function Home() {
  const [open, setopen] = React.useState<boolean>(false);
  return (
    <>
      <Navbar />
    </>
  );
}
