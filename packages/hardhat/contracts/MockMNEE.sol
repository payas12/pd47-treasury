// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockMNEE is ERC20 {
    constructor() ERC20("MNEE Stablecoin", "MNEE") {
        // Mint 1 Million MNEE to the deployer (You)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Function to give free tokens to anyone for testing
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}