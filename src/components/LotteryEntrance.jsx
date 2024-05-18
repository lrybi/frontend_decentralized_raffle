"use client"

import { contractAddresses, abi } from "../../constants";
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi' 
import { useReadContract, useReadContracts } from 'wagmi'
import { parseEther, formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import { useEffect } from "react";

export default function LotteryEntrance() {

    const raffleAddress = useChainId() in contractAddresses ? contractAddresses[useChainId()][0]: null;

    const { data: entranceFeeFromCall, isPending: entranceFeePending, error:entranceFeeError, isSuccess: entranceFeeSuccess } = useReadContract({
        abi: abi,
        address: raffleAddress, 
        functionName: "getEntranceFee",
        args: [],
    });

    const { data: hash, isPending, error: writeError, writeContract } = useWriteContract()

    const request = {
        abi: abi,
        address: raffleAddress, 
        functionName: "enterRaffle",
        args: [],
        value: parseEther("9"), 
    }
    
    let blockConfirmations = 1;
        
    if (useChainId() != 31337) { blockConfirmations = 6; }
    
    const { isLoading: isConfirming, isSuccess: isConfirmed} =
        useWaitForTransactionReceipt({
            hash,
            confirmations: blockConfirmations,
        })
    
    const wagmigotchiContract = {
        address: raffleAddress,
        abi: abi,
    }
    const { data: numPlayersAndWinnerFromCall, isPending: numPlayersAndWinnerPending, error:numPlayersAndWinnerError, isSuccess: numPlayersAndWinnerSuccess, refetch: refetchNumPlayersAndWinner} = useReadContracts({
        contracts: [{
            ...wagmigotchiContract, 
            functionName: "getNumberOfPlayers",
            args: [],
        }, {
            ...wagmigotchiContract, 
            functionName: "getRecentWinner",
            args: [],            
        }]
    });
   
    useEffect(() => {
        refetchNumPlayersAndWinner?.();
            
    }, [isConfirmed]);
     
    return (
        <div>
           
            <div>(CurrentNetwork ChainId: {useChainId()})</div>
            <button
                
                disabled={isPending || isConfirming}
                
                onClick={() => writeContract(request)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            >
                {isPending ? (
                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                    "Enter Raffle"
                )}
            </button>
            <p className=" font-mono font-bold italic text-blue-500">
                {entranceFeePending && "Loading..."}
                {entranceFeeError && <div>Error: {(entranceFeeError).shortMessage || error.message}</div>}
                {entranceFeeSuccess &&<div>Entrance Fee: {formatUnits(entranceFeeFromCall, 18)?.toString()} ETH</div>}
            </p>

            <p className=" font-mono italic text-rose-500">
                {numPlayersAndWinnerPending && "Loading..."}
                {numPlayersAndWinnerError && <div>Error: {(numPlayersAndWinnerError).shortMessage || error.message}</div>}
                {numPlayersAndWinnerSuccess &&
                    <div>
                        <div>Number Of Players: {(numPlayersAndWinnerFromCall[0].result)?.toString()}</div>
                        <div>Recent Winner: {(numPlayersAndWinnerFromCall[1].result)?.toString()}</div>
                    </div>
                }
            </p>

            
            {isPending && (<div>Confirming...</div>)}

            {Boolean(writeError) && (<div>Error: {writeError.shortMessage ?? writeError.message}</div>)}

            {hash && (<div>The transaction was sent. Here is its hash: {hash}</div>)}
                
            {isConfirming && <div>Waiting for confirmation...</div>} 
            {isConfirmed && <div>Transaction confirmed (by {blockConfirmations} blocks).</div>}
        
        </div>
    );
};
