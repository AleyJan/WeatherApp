"use client"

import React from 'react';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

// Dynamically load the IndexPage component
const DynamicIndexPage = dynamic(() => import('../components/index'));

const HomePage: React.FC = () => {
    return (
    <main className='flex flex-col items-center gap-y-8 text-2xl font-bold'>
    <Navbar  />
    <DynamicIndexPage />
    </main>
    );
};

export default HomePage;
