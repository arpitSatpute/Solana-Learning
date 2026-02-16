// Step 1:  Adding Imports

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info:: {AccountInfo, next_account_info, next_account_infos}, entrypoint,  entrypoint::{ProgramResult}, msg, pubkey::Pubkey
};

// Step 3: Defining the Instructions 
 
#[derive(BorshDeserialize, BorshSerialize)]
enum Instruction_Type {
    Increment(u32),
    Decrement(u32)
}



#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count : u32,
}


// Step 2: Define EntryPoint Function
entrypoint!(counter_contrct);



// Step 4: Writng the process instrunctions.

pub fn counter_contrct(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    
    let acc = next_account_info(&mut accounts.iter())?;

    let instruction_type = Instruction_Type::try_from_slice(instruction_data)?;
    let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;

    match instruction_type {
        Instruction_Type::Increment(value) => {
            msg!("Incrementing.......");
            counter_data.count += value;
        },
        Instruction_Type::Decrement(value) => {
            msg!("Decrementing.......");
            counter_data.count -= value;
        }
    }

    counter_data.serialize(&mut *acc.data.borrow_mut())?; 
    msg!("Contract Succeded");
    Ok(())
}