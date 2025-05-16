// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FTNToken
 * @dev ERC20 Token with deposit and withdrawal functionality for cross-chain bridging
 */
contract FTNToken is ERC20, Ownable {
    // Event emitted when tokens are deposited for bridging
    event Deposit(address indexed user, uint256 amount, bytes32 depositId);
    
    // Mapping to track deposits that have been processed
    mapping(bytes32 => bool) public processedDeposits;
    
    // Bridge contract address that is authorized to process withdrawals
    address public bridgeAddress;
    
    /**
     * @dev Constructor that gives the msg.sender all of the initial supply
     */
    constructor(uint256 initialSupply) ERC20("Forte Token", "FTN") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
    
    /**
     * @dev Set the bridge contract address
     * @param _bridgeAddress The address of the bridge contract
     */
    function setBridgeAddress(address _bridgeAddress) external onlyOwner {
        bridgeAddress = _bridgeAddress;
    }
    
    /**
     * @dev Deposit tokens for bridging to Stellar
     * @param amount The amount of tokens to deposit
     * @param depositId A unique identifier for this deposit
     */
    function deposit(uint256 amount, bytes32 depositId) external {
        require(amount > 0, "Amount must be greater than 0");
        require(!processedDeposits[depositId], "Deposit ID already processed");
        
        // Transfer tokens from user to this contract
        _transfer(msg.sender, address(this), amount);
        
        // Mark deposit as processed
        processedDeposits[depositId] = true;
        
        // Emit deposit event
        emit Deposit(msg.sender, amount, depositId);
    }
    
    /**
     * @dev Withdraw tokens after a burn on Stellar
     * @param recipient The address to receive the tokens
     * @param amount The amount of tokens to withdraw
     * @param depositId The original deposit ID
     */
    function withdraw(address recipient, uint256 amount, bytes32 depositId) external {
        require(msg.sender == bridgeAddress, "Only bridge can withdraw");
        require(amount > 0, "Amount must be greater than 0");
        require(processedDeposits[depositId], "Deposit ID not found");
        
        // Transfer tokens from this contract to the recipient
        _transfer(address(this), recipient, amount);
    }
}
