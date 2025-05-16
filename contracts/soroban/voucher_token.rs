#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, 
    symbol_short, Address, Bytes, Env, Symbol,
    Vec, log, BytesN
};

// Contract storage keys
const BALANCE: Symbol = symbol_short!("BAL");
const TOTAL_SUPPLY: Symbol = symbol_short!("TSUP");
const ADMIN: Symbol = symbol_short!("ADMIN");
const METADATA: Symbol = symbol_short!("META");
const ESCROW_DATA: Symbol = symbol_short!("ESCROW");

#[derive(Clone)]
#[contracttype]
pub struct TokenMetadata {
    pub name: Bytes,
    pub symbol: Bytes,
    pub decimals: u32,
}

#[derive(Clone)]
#[contracttype]
pub struct EscrowData {
    pub sender: Address,
    pub amount: u64,
    pub claimed: bool,
}

#[contract]
pub struct VoucherToken;

#[contractimpl]
impl VoucherToken {
    // Initialize the token contract
    pub fn initialize(env: Env, admin: Address, name: Bytes, symbol: Bytes, decimals: u32) {
        if env.storage().instance().has(&ADMIN) {
            panic!("contract already initialized");
        }
        
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&TOTAL_SUPPLY, &0u64);
        
        let metadata = TokenMetadata {
            name,
            symbol,
            decimals,
        };
        env.storage().instance().set(&METADATA, &metadata);
    }
    
    // Get the token metadata
    pub fn metadata(env: Env) -> TokenMetadata {
        env.storage().instance().get(&METADATA).unwrap()
    }
    
    // Get the token balance for an address
    pub fn balance(env: Env, addr: Address) -> u64 {
        env.storage().instance().get(&(BALANCE, addr)).unwrap_or(0)
    }
    
    // Get the total supply of tokens
    pub fn total_supply(env: Env) -> u64 {
        env.storage().instance().get(&TOTAL_SUPPLY).unwrap_or(0)
    }
    
    // Mint new tokens to a recipient
    pub fn mint(env: Env, to: Address, amount: u64, deposit_id: Symbol) -> u64 {
        // Only admin can mint
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        
        // Check if this deposit_id has already been processed
        let escrow_key = (ESCROW_DATA, deposit_id.clone());
        if env.storage().instance().has(&escrow_key) {
            panic!("deposit already processed");
        }
        
        // Record the escrow data
        let escrow_data = EscrowData {
            sender: to.clone(),
            amount,
            claimed: false,
        };
        env.storage().instance().set(&escrow_key, &escrow_data);
        
        // Update recipient's balance
        let balance = Self::balance(env.clone(), to.clone());
        let new_balance = balance + amount;
        env.storage().instance().set(&(BALANCE, to.clone()), &new_balance);
        
        // Update total supply
        let total = Self::total_supply(env.clone());
        let new_total = total + amount;
        env.storage().instance().set(&TOTAL_SUPPLY, &new_total);
        
        // Log the mint event
        log!(&env, "mint: to={}, amount={}, deposit_id={}", to, amount, deposit_id);
        
        new_balance
    }
    
    // Burn tokens from a sender
    pub fn burn(env: Env, from: Address, amount: u64, deposit_id: Symbol) -> u64 {
        // Require authorization from the sender
        from.require_auth();
        
        // Check if this deposit_id exists and hasn't been claimed
        let escrow_key = (ESCROW_DATA, deposit_id.clone());
        if !env.storage().instance().has(&escrow_key) {
            panic!("deposit not found");
        }
        
        let escrow_data: EscrowData = env.storage().instance().get(&escrow_key).unwrap();
        if escrow_data.claimed {
            panic!("deposit already claimed");
        }
        
        // Check that the amount matches the original deposit
        if amount != escrow_data.amount {
            panic!("amount must match original deposit");
        }
        
        // Check that the sender has enough balance
        let balance = Self::balance(env.clone(), from.clone());
        if balance < amount {
            panic!("insufficient balance");
        }
        
        // Update sender's balance
        let new_balance = balance - amount;
        env.storage().instance().set(&(BALANCE, from.clone()), &new_balance);
        
        // Update total supply
        let total = Self::total_supply(env.clone());
        let new_total = total - amount;
        env.storage().instance().set(&TOTAL_SUPPLY, &new_total);
        
        // Mark the escrow as claimed
        let updated_escrow = EscrowData {
            sender: escrow_data.sender,
            amount: escrow_data.amount,
            claimed: true,
        };
        env.storage().instance().set(&escrow_key, &updated_escrow);
        
        // Log the burn event
        log!(&env, "burn: from={}, amount={}, deposit_id={}", from, amount, deposit_id);
        
        new_balance
    }
    
    // Get escrow data for a deposit
    pub fn get_escrow(env: Env, deposit_id: Symbol) -> EscrowData {
        let escrow_key = (ESCROW_DATA, deposit_id.clone());
        if !env.storage().instance().has(&escrow_key) {
            panic!("deposit not found");
        }
        
        env.storage().instance().get(&escrow_key).unwrap()
    }
    
    // Transfer tokens between addresses
    pub fn transfer(env: Env, from: Address, to: Address, amount: u64) -> u64 {
        from.require_auth();
        
        let from_balance = Self::balance(env.clone(), from.clone());
        if from_balance < amount {
            panic!("insufficient balance");
        }
        
        let to_balance = Self::balance(env.clone(), to.clone());
        
        env.storage().instance().set(&(BALANCE, from), &(from_balance - amount));
        env.storage().instance().set(&(BALANCE, to), &(to_balance + amount));
        
        to_balance + amount
    }
}
