"use client";

import Image from "next/image";
import { useAccount } from 'wagmi';
import LotteryEntrance from "@/components/LotteryEntrance";

  
export default function Home() {
  const { isConnected, isDisconnected } = useAccount()
 
  return (
    <div className="w-full">
      <div className=" flex flex-col items-center justify-center h-screen space-y-10">
        <h1 className=" text-4xl font-mono font-bold">
          {isDisconnected && ("Connet your wallet")}
        </h1> 
        {isConnected && (
          <div>
            <h1 className=" text-4xl font-mono font-bold text-rose-500">Welcome Decentralized Lottery</h1>
            <LotteryEntrance/>
          </div>
        )}        
      </div>
    </div>
  );
}
