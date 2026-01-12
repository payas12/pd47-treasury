"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { parseEther, formatEther } from "viem";
import { useScaffoldWriteContract, useScaffoldReadContract, useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useAccount, useWriteContract, useReadContract, useChainId } from "wagmi";
import { erc20Abi } from "viem";

const REAL_MNEE_ADDRESS = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF";

// --- COMPONENT: INDIVIDUAL JOB ROW ---
const JobRow = ({ jobId, onUpdate }: { jobId: bigint, onUpdate: () => void }) => {
  const { data: job, refetch: refetchJob } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "jobs",
    args: [jobId],
  });

  const { writeContractAsync: writeTreasury } = useScaffoldWriteContract("YourContract");

  if (!job) return null;

  const name = job[1];
  const amount = job[2];
  const isCompleted = job[4];
  const isPaid = job[5];

  const handleApprove = async () => {
    await writeTreasury({
      functionName: "markJobComplete",
      args: [jobId],
    });
    // Force immediate update of UI
    await refetchJob();
    if(onUpdate) onUpdate();
  };

  return (
    <div className="border-t border-black py-4 flex justify-between items-center animate-pulse-fast">
      <div>
        <p className="font-serif text-xl">{String(name)}</p>
        <p className="text-xs uppercase text-gray-400 mt-1">
          Status: {isPaid ? "PAID 💰" : isCompleted ? "APPROVED ✅" : "PENDING ⏳"}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold">{formatEther(amount)} MNEE</p>
        
        {isPaid ? (
          <button 
            className="text-xs uppercase underline hover:no-underline mt-2 block ml-auto font-bold cursor-pointer"
            disabled
          >
            PAID
          </button>
        ) : (
          <button 
            className="text-xs uppercase underline hover:no-underline mt-2 block ml-auto font-bold cursor-pointer"
            onClick={handleApprove}
          >
            [ APPROVE RELEASE ]
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const Home: NextPage = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  
  // Form State
  const [jobName, setJobName] = useState("");
  const [freelancer, setFreelancer] = useState("");
  const [amount, setAmount] = useState("");

  // 1. Get Contracts
  const { data: treasuryContract } = useScaffoldContract({ contractName: "YourContract" });
  const { data: mockMneeContract } = useScaffoldContract({ contractName: "MockMNEE" });

  const isLocal = chainId === 31337;
  const currentMneeAddress = isLocal ? mockMneeContract?.address : REAL_MNEE_ADDRESS;

  // 2. READ BALANCE (With Refetch Capability)
  const { data: myBalance, refetch: refetchBalance } = useReadContract({
    address: currentMneeAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });

  // 3. READ TOTAL JOBS (With Refetch Capability)
  const { data: jobsLength, refetch: refetchJobs } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "jobsLength",
  });

  // 4. Write Hooks
  const { writeContractAsync: writeToken } = useWriteContract();
  const { writeContractAsync: writeTreasury } = useScaffoldWriteContract("YourContract");

  const handleCreate = async () => {
    if (!treasuryContract || !currentMneeAddress) return;
    try {
      const amountWei = parseEther(amount);

      // A. Approve
      console.log(`Approving ${isLocal ? "Mock" : "Real"} MNEE...`);
      await writeToken({
        address: currentMneeAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [treasuryContract.address, amountWei],
      });
      
      // B. Create Job
      console.log("Creating Job...");
      await writeTreasury({
        functionName: "createJob",
        args: [jobName, freelancer, amountWei],
      });
      
      // C. FORCE UPDATE
      await refetchBalance(); // Updates the top balance immediately
      await refetchJobs();    // Updates the list immediately
      
      alert("✅ Job Created! Ledger Updated.");
    } catch (e) {
      console.error(e);
      alert("❌ Error: Check Console");
    }
  };

  // Helper to refresh everything if a child component updates
  const refreshAll = async () => {
    await refetchBalance();
    await refetchJobs();
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 bg-white min-h-screen">
      <div className="px-5 w-full max-w-lg">
        {/* HEADER */}
        <h1 className="text-center mb-12 mt-8">
          <span className="block text-5xl font-serif tracking-widest text-black mb-2">PD 47</span>
          <span className="block text-xs uppercase tracking-[0.3em] text-gray-500">The Vault Collection</span>
        </h1>

        {/* WALLET INFO */}
        <div className="border border-black p-6 mb-8 text-center bg-gray-50">
          <span className="block text-xs uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: isLocal ? "#D4AF37" : "#000000" }}>
  {isLocal ? "✦ SIMULATION MODE // DEVNET ✦" : "● LIVE NETWORK // MAINNET ●"}
</span>
          <div className="text-3xl font-serif text-black">
            {/* The Balance Display */}
            {myBalance ? formatEther(myBalance as bigint) : "0"} <span className="text-sm align-top">MNEE</span>
          </div>
        </div>

        {/* JOB CREATOR FORM */}
        <div className="border border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <h2 className="text-lg font-bold mb-6 uppercase tracking-widest border-b border-black pb-2">Create Transaction</h2>
          
          <div className="flex flex-col gap-6">
            <div className="form-control">
                <label className="label-text text-xs uppercase tracking-wider mb-1">Project Name</label>
                <input type="text" placeholder="E.g. Genesis Render" className="input input-bordered w-full rounded-none border-black focus:outline-none focus:ring-1 focus:ring-black bg-transparent" onChange={e => setJobName(e.target.value)} />
            </div>
            <div className="form-control">
                <label className="label-text text-xs uppercase tracking-wider mb-1">Recipient</label>
                <input type="text" placeholder="0x..." className="input input-bordered w-full rounded-none border-black focus:outline-none focus:ring-1 focus:ring-black bg-transparent" onChange={e => setFreelancer(e.target.value)} />
            </div>
            <div className="form-control">
                <label className="label-text text-xs uppercase tracking-wider mb-1">Amount</label>
                <div className="join w-full">
                <input type="text" placeholder="0.00" className="input input-bordered join-item w-full rounded-none border-black focus:outline-none focus:ring-1 focus:ring-black bg-transparent" onChange={e => setAmount(e.target.value)} />
                <span className="btn btn-static join-item rounded-none border-black bg-black text-white border-l-0">MNEE</span>
                </div>
            </div>
            <button className="btn btn-primary w-full rounded-none bg-black hover:bg-white hover:text-black border-black text-white uppercase tracking-widest mt-2" onClick={handleCreate}>
              Authorize Payment
            </button>
          </div>
        </div>

        {/* LIVE LEDGER LIST */}
        <div className="mt-12 p-0 mb-20">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-center">LIVE LEDGER ({Number(jobsLength || 0)})</h3>
          
          {jobsLength && Number(jobsLength) > 0 ? (
            [...Array(Number(jobsLength))].map((_, i) => (
               <JobRow key={i} jobId={BigInt(i)} onUpdate={refreshAll} />
            )).reverse() 
          ) : (
             <p className="text-center text-xs uppercase text-gray-400">No transactions yet.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;