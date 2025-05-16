// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FTNToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FTNBridge
 * @dev Bridge contract to handle cross-chain transfers between Bahamut and Stellar
 */
contract FTNBridge is Ownable {
    // FTN token contract
    FTNToken public ftnToken;
    
    // Mapping to track processed burns from Stellar
    mapping(bytes32 => bool) public processedBurns;
    
    // Event emitted when tokens are released back to the user
    event TokensReleased(address indexed recipient, uint256 amount, bytes32 depositId);
    
    /**
     * @dev Constructor
     * @param _ftnToken Address of the FTN token contract
     */
    constructor(address _ftnToken) Ownable(msg.sender) {
        ftnToken = FTNToken(_ftnToken);
    }
    
    /**
     * @dev Release tokens back to a user after a burn on Stellar
     * @param recipient Address to receive the tokens
     * @param amount Amount of tokens to release
     * @param depositId Original deposit ID
     */
    function releaseTokens(address recipient, uint256 amount, bytes32 depositId) external onlyOwner {
        require(!processedBurns[depositId], "Burn already processed");
        require(amount > 0, "Amount must be greater than 0");
        
        // Mark burn as processed
        processedBurns[depositId] = true;
        
        // Withdraw tokens from the FTN contract to the recipient
        ftnToken.withdraw(recipient, amount, depositId);
        
        // Emit event
        emit TokensReleased(recipient, amount, depositId);
    }
    
    /**
     * @dev Check if a burn has been processed
     * @param depositId The deposit ID to check
     * @return bool True if the burn has been processed
     */
    function isBurnProcessed(bytes32 depositId) external view returns (bool) {
        return processedBurns[depositId];
    }
}
