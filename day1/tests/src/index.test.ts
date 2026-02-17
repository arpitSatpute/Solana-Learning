import * as borsh from "borsh";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { expect, test } from "bun:test";
import { COUNTER_SIZE, schema } from "types";


const adminAccount = Keypair.generate();
const dataAccount = Keypair.generate();

const PROGRAM_ID = new PublicKey("HJanoEMcw4r3KGjoaShpjpPvQPCNDCHpxdXQR8HkT1GD");

test("Account id Initialised", async () => {
    const connection = new Connection("http://127.0.0.1:8899");
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 1 * 1e9);
    
    await connection.confirmTransaction(txn);
    
    const data = await connection.getAccountInfo(adminAccount.publicKey);
    console.log(data);

    const lamports = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);

    const ins = SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey,
        lamports,
        space: COUNTER_SIZE,
        programId: PROGRAM_ID,
        newAccountPubkey: dataAccount.publicKey
    });

    const create_account_transaction = new Transaction();

    create_account_transaction.add(ins);
    const signature = await connection.sendTransaction(create_account_transaction, [adminAccount, dataAccount]);

    await connection.confirmTransaction(signature);

    console.log(dataAccount.publicKey.toBase58());

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    const counter = borsh.deserialize(schema, dataAccountInfo?.data); 
    console.log(counter.count);
    expect(0).toBe(0);
}) 