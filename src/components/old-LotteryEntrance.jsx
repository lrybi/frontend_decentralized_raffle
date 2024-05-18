
"use client"

import { contractAddresses, abi } from "../../constants";
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi' 
    
import { parseEther } from 'viem';
import { useChainId } from 'wagmi';

export default function LotteryEntrance() {
    
    const { data: simulateData, error: simulateError } = useSimulateContract({
         
        abi:abi,
        address: contractAddresses[useChainId()][0], 
        functionName: "enterRaffle",
        args: [],
        value: parseEther("9"), 
    });

    const { data: hash, isPending, error: writeError, writeContract } = useWriteContract()  
    
    let blockConfirmations = 1;
     
    if (useChainId() != 31337) { blockConfirmations = 6; }
 
    const { isLoading: isConfirming, isSuccess: isConfirmed} =
        useWaitForTransactionReceipt({
            hash,
            confirmations: blockConfirmations,      
        }) 

    return (
        <div>
            <div>(CurrentNetwork ChainId: {useChainId()})</div>
            <button      
                disabled={isPending || !Boolean(simulateData?.request) || isConfirming}  
                onClick={() => writeContract(simulateData.request)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            >
                Enter Raflfe
            </button>

            {Boolean(simulateError) && (<div>The transaction is expected to fail with this error: {simulateError.shortMessage ?? simulateError.message}</div>)}
                
            {isPending && (<div>Confirming...</div>)}

            {hash && (<div>The transaction was sent. Here is its hash: {hash}</div>)}
            
            {isConfirming && <div>Waiting for confirmation...</div>} 
            {isConfirmed && <div>Transaction confirmed (by {blockConfirmations} blocks).</div>}
        
        </div>
    );
};







