/* eslint-disable no-console */
const hre = require("hardhat");

async function main() {
  console.log("🤖 AI Agent (PD-47 Edition) waking up...");
  
  const treasuryContract = await hre.ethers.getContract("YourContract");
  
  // 1. Get total number of jobs from the contract
  let totalJobs = 0;
  try {
    totalJobs = await treasuryContract.jobsLength();
  } catch (e) {
    console.log("⚠️ Could not fetch length, checking first 10 slots...");
    totalJobs = 10; 
  }

  console.log(`🔎 Scanning ${totalJobs} jobs for approved work...`);

  let actionsTaken = 0;

  // 2. Loop through EVERY job (from 0 to totalJobs)
  for (let i = 0; i < totalJobs; i++) {
    try {
      const job = await treasuryContract.jobs(i);
      
      // Skip empty jobs
      if (job[1] === "") continue;

      const jobName = job[1];
      const isCompleted = job[4]; // ✅ Approved by Human?
      const isPaid = job[5];      // 💰 Paid by Agent?

      // 3. The Logic: If Approved AND Not Paid -> PAY IT
      if (isCompleted && !isPaid) {
        console.log(`\n⚡ FOUND TASK: Job #${i} ("${jobName}") is Approved but Unpaid.`);
        console.log(`   Initiating Transfer...`);
        
        const tx = await treasuryContract.aiPayJob(i);
        console.log(`   ⏳ Transaction hash: ${tx.hash}`);
        await tx.wait();
        
        console.log(`   🎉 Job #${i} PAID Successfully!`);
        actionsTaken++;
      } 
    } catch (error) {
      break;
    }
  }

  if (actionsTaken === 0) {
    console.log("\n💤 Scan complete. All approved jobs are already paid.");
    console.log("   (Go to the Website, create a NEW job, and click 'Approve'!)");
  } else {
    console.log(`\n✅ Agent Work Complete. ${actionsTaken} payments processed.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});