"use client"
   
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
    return (
        <div className="border-b border-white h-20 flex flex-row items-center">
            <div className=" flex flex-row">
                <ConnectButton showBalance={true} />
            </div>
        </div>
    );
};