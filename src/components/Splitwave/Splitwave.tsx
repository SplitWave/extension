import * as anchor from "@project-serum/anchor";
import { AnchorProvider, BN, Program } from "projectSerumAnchor0250";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import * as SPLITWAVE_IDL from "./../../idl/splitwave.json";
import * as SPLITWAVE_TYPES from "./splitwave";
import { SEED_SPLITWAVE } from "./splitwaveConfig";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "solanaSPLToken036";
import { useEffect, useState } from "react";
import {
  testwallet1,
  testwallet2,
  testwallet4,
  testwalletl3,
  testwalletm3,
} from "./splitwaveConfig";
const Splitwave = () => {
  const { wallet, connected, connect } = useWallet();
  const connection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl("devnet")
  );
  const findSplitwavePda = async (
    authority: PublicKey,
    mint: PublicKey,
    recipient: PublicKey
  ) => {
    const [splitwavePda] = await PublicKey.findProgramAddress(
      [
        // Buffer.from(SEED_SPLITWAVE),
        anchor.utils.bytes.utf8.encode(SEED_SPLITWAVE),
        authority.toBuffer(),
        mint.toBuffer(),
        recipient.toBuffer(),
      ],
      new PublicKey(SPLITWAVE_IDL.metadata.address)
    );
    return splitwavePda;
  };

  const createSplitwave = async () => {
    let wallet_t = wallet as any;
    const create_splitwave_ixs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_IDL.metadata.address,
      provider
    );
    const splitwave = await findSplitwavePda(
      testwallet1,
      NATIVE_MINT,
      testwalletl3
    );

    console.log("splitwave: ", splitwave);
    let participants = [
      {
        split: new BN(0.5 * LAMPORTS_PER_SOL),
        paid: false,
        participant: testwallet1,
      },
      {
        split: new BN(0.3 * LAMPORTS_PER_SOL),
        paid: false,
        participant: testwallet2,
      },
      {
        split: new BN(0.2 * LAMPORTS_PER_SOL),
        paid: false,
        participant: testwalletm3,
      },
    ];

    let splitwave_token_account = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );
    console.log("splitwave_token_account: ", splitwave_token_account);

    let create_splitwave_ix = splitWaveProgram.instruction.createSplitwave(
      new BN(1 * LAMPORTS_PER_SOL),
      participants,
      {
        accounts: {
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          authority: testwallet1,
          mint: NATIVE_MINT,
          splitwave: splitwave,
          splitwave_token_account: splitwave_token_account,
          recipient: testwalletl3,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
    );
    create_splitwave_ixs.push(create_splitwave_ix);
    const tx = await wallet_t.signTransaction({
      feePayer: wallet_t.publicKey,
      instructions: create_splitwave_ixs,
    });
    const txid = await connection.sendRawTransaction(tx.serialize());
    console.log("txid: ", txid);
  };

  const paySplitwave = async () => {
    let wallet_t = wallet as any;
    const pay_splitwave_ixs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_IDL.metadata.address,
      provider
    );
    const splitwave = await findSplitwavePda(
      testwallet1,
      NATIVE_MINT,
      testwalletl3
    );
    console.log("splitwave: ", splitwave);

    let participant_token_account = await getAssociatedTokenAddress(
      testwallet1,
      NATIVE_MINT
    );
    console.log("participant_token_account: ", participant_token_account);
    let splitwave_token_account = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );

    let pay_splitwave_ix = splitWaveProgram.instruction.paySplitwave(
      new BN(0.5 * LAMPORTS_PER_SOL),
      {
        accounts: {
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          participant: testwallet1,
          authority: testwallet1,
          participant_token_account: participant_token_account,
          mint: NATIVE_MINT,
          splitwave: splitwave,
          splitwave_token_account: splitwave_token_account,
          recipient: testwalletl3,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
    );
    pay_splitwave_ixs.push(pay_splitwave_ix);
    const tx = await wallet_t.signTransaction({
      feePayer: wallet_t.publicKey,
      instructions: pay_splitwave_ixs,
    });
    const txid = await connection.sendRawTransaction(tx.serialize());
    console.log("txid: ", txid);
  };

  const disburseSplitwave = async () => {
    let wallet_t = wallet as any;
    const disburse_splitwave_ixs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_IDL.metadata.address,
      provider
    );
    const splitwave = await findSplitwavePda(
      testwallet1,
      NATIVE_MINT,
      testwalletl3
    );
    console.log("splitwave: ", splitwave);
    let splitwave_token_account = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );
    console.log("splitwave_token_account: ", splitwave_token_account);
    let recipient_token_account = await getAssociatedTokenAddress(
      testwalletl3,
      NATIVE_MINT
    );
    console.log("recipient_token_account: ", recipient_token_account);

    let disburse_splitwave_ix = splitWaveProgram.instruction.disburseSplitwave({
      accounts: {
        authority: testwallet1,
        mint: NATIVE_MINT,
        splitwave: splitwave,
        splitwave_token_account: splitwave_token_account,
        recipient: testwalletl3,
        recipient_token_account: recipient_token_account,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
    disburse_splitwave_ixs.push(disburse_splitwave_ix);
    const tx = await wallet_t.signTransaction({
      feePayer: wallet_t.publicKey,
      instructions: disburse_splitwave_ixs,
    });
    const txid = await connection.sendRawTransaction(tx.serialize());
    console.log("txid: ", txid);
  };

  const updateSplitwave = async () => {
    let wallet_t = wallet as any;
    const update_splitwave_ixs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_IDL.metadata.address,
      provider
    );
    const splitwave = await findSplitwavePda(
      testwallet1,
      NATIVE_MINT,
      testwalletl3
    );
    console.log("splitwave: ", splitwave);
    let participants = [
      {
        split: new BN(1 * LAMPORTS_PER_SOL),
        paid: false,
        participant: testwallet1,
      },
      {
        split: new BN(0.6 * LAMPORTS_PER_SOL),
        paid: false,
        participant: testwallet2,
      },
      {
        split: new BN(0.4 * LAMPORTS_PER_SOL),
        paid: false,
        participant: testwalletm3,
      },
    ];
    let splitwave_token_account = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );
    console.log("splitwave_token_account: ", splitwave_token_account);
    let recipient_token_account = await getAssociatedTokenAddress(
      testwalletl3,
      NATIVE_MINT
    );
    console.log("recipient_token_account: ", recipient_token_account);

    let update_splitwave_ix = splitWaveProgram.instruction.updateSplitwave(
      new BN(2 * LAMPORTS_PER_SOL),
      participants,
      {
        accounts: {
          authority: testwallet1,
          mint: NATIVE_MINT,
          splitwave: splitwave,
          splitwave_token_account: splitwave_token_account,
          recipient: testwalletl3,
          recipient_token_account: recipient_token_account,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      }
    );
    update_splitwave_ixs.push(update_splitwave_ix);
    const tx = await wallet_t.signTransaction({
      feePayer: wallet_t.publicKey,
      instructions: update_splitwave_ixs,
    });
    const txid = await connection.sendRawTransaction(tx.serialize());
    console.log("txid: ", txid);
  };

  return (
    <div>
      <h1>Splitwave</h1>
    </div>
  );
};

export default Splitwave;
