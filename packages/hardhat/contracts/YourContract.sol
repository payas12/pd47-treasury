//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract YourContract {
    address public owner;
    IERC20 public mneeToken; // The MNEE Token Address

    struct Job {
        uint256 id;
        string name;
        uint256 amount;
        address freelancer;
        bool isCompleted;
        bool isPaid;
    }

    Job[] public jobs;

    // Pass the MNEE token address when deploying
    constructor(address _owner, address _mneeTokenAddress) {
        owner = _owner;
        mneeToken = IERC20(_mneeTokenAddress);
    }

    // CEO Creates Job (Must approve MNEE first!)
    function createJob(string memory _name, address _freelancer, uint256 _amount) public {
        // 1. Transfer MNEE from CEO -> Treasury
        // Note: You must call "Approve" on the MNEE token first from the UI!
        bool success = mneeToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "Failed to deposit MNEE. Did you Approve?");

        // 2. Create Job Record
        uint256 newJobId = jobs.length;
        jobs.push(Job(newJobId, _name, _amount, _freelancer, false, false));
        
        console.log("New MNEE Job Created:", _name);
    }

    function markJobComplete(uint256 _jobId) public {
        require(_jobId < jobs.length, "Job ID does not exist");
        jobs[_jobId].isCompleted = true;
    }

    function aiPayJob(uint256 _jobId) public {
        Job storage job = jobs[_jobId];

        require(job.isCompleted, "Job not finished");
        require(!job.isPaid, "Job already paid");

        job.isPaid = true;

        // PAY IN MNEE
        bool success = mneeToken.transfer(job.freelancer, job.amount);
        require(success, "MNEE Transfer failed");

        console.log("AI Paid MNEE for:", job.name);
    }
    
    // Helper to see MNEE balance of this contract
    function treasuryBalance() public view returns (uint256) {
        return mneeToken.balanceOf(address(this));
    }

    function jobsLength() public view returns (uint256) {
        return jobs.length;
    }
}