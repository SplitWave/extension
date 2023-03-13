import * as anchor from "projectSerumAnchor0260";
import { AnchorProvider, BN, Program } from "projectSerumAnchor0260";
import { useWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "solanaSPLToken037";

import * as SPLITWAVE_IDL from "./../../idl/splitwave.json";
import * as SPLITWAVE_TYPES from "./splitwave";
import { SEED_SPLITWAVE, SPLITWAVE_ADDRESS } from "./splitwaveConfig";

import {
  testwallet1,
  testwallet2,
  testwalletl3,
  testwalletm3,
} from "./splitwaveConfig";

import { sendTransactions } from "../../config/connection";

const Splitwave = () => {
  const { connected, connect, publicKey } = useWallet();
  const wallet = useWallet();

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
        Buffer.from(SEED_SPLITWAVE),
        // anchor.utils.bytes.utf8.encode(SEED_SPLITWAVE),
        authority.toBuffer(),
        mint.toBuffer(),
        recipient.toBuffer(),
      ],
      new PublicKey(SPLITWAVE_ADDRESS)
    );
    return splitwavePda;
  };

  const createSplitwave = async () => {
    let wallet_t = wallet as any;
    const createSplitwaveIxs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_ADDRESS,
      provider
    );
    const splitwave = await findSplitwavePda(
      wallet_t.publicKey,
      NATIVE_MINT,
      testwalletl3
    );

    console.log("splitwave: ", splitwave.toBase58());
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

    let splitwaveTokenAccount = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );
    console.log("splitwaveTokenAccount: ", splitwaveTokenAccount.toBase58());
    console.log("testwalletl3: ", testwalletl3.toBase58());
    console.log(
      "wallet_t.publicKey.toBase58(): ",
      wallet_t.publicKey.toBase58()
    );
    console.log("wallet_t.publicKey: ", wallet_t.publicKey);

    let createSplitwaveIx = splitWaveProgram.instruction.createSplitwave(
      new BN(1 * LAMPORTS_PER_SOL),
      participants,
      {
        accounts: {
          authority: wallet_t.publicKey,
          mint: NATIVE_MINT,
          recipient: testwalletl3,
          splitwave: splitwave,
          splitwaveTokenAccount: splitwaveTokenAccount,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
      }
    );
    createSplitwaveIxs.push(createSplitwaveIx);
    const createSplitwaveSignature = await sendTransactions(
      connection,
      wallet,
      [createSplitwaveIxs],
      [[]]
    );
    console.log("createSplitwaveSignature: ", createSplitwaveSignature);
  };

  const paySplitwave = async () => {
    let wallet_t = wallet as any;
    const paySplitwaveIxs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_ADDRESS,
      provider
    );
    const splitwave = await findSplitwavePda(
      testwallet1,
      NATIVE_MINT,
      testwalletl3
    );
    console.log("splitwave: ", splitwave);

    let participantTokenAccount = await getAssociatedTokenAddress(
      wallet_t.publicKey,
      NATIVE_MINT
    );
    console.log("participantTokenAccount: ", participantTokenAccount);
    let splitwaveTokenAccount = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );

    let paySplitwaveIx = splitWaveProgram.instruction.paySplitwave(
      new BN(0.5 * LAMPORTS_PER_SOL),
      {
        accounts: {
          authority: testwallet1,
          mint: NATIVE_MINT,
          recipient: testwalletl3,
          splitwave: splitwave,
          splitwaveTokenAccount: splitwaveTokenAccount,
          participant: wallet_t.publicKey,
          participantTokenAccount: participantTokenAccount,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
      }
    );
    paySplitwaveIxs.push(paySplitwaveIx);
    const paySplitwaveSignature = await sendTransactions(
      connection,
      wallet,
      [paySplitwaveIxs],
      [[]]
    );
    console.log("paySplitwaveSignature: ", paySplitwaveSignature);
  };

  const disburseSplitwave = async () => {
    let wallet_t = wallet as any;
    const disburseSplitwaveIxs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_ADDRESS,
      provider
    );
    const splitwave = await findSplitwavePda(
      testwallet1,
      NATIVE_MINT,
      testwalletl3
    );
    console.log("splitwave: ", splitwave);
    let splitwaveTokenAccount = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );
    console.log("splitwaveTokenAccount: ", splitwaveTokenAccount);
    let recipientTokenAccount = await getAssociatedTokenAddress(
      testwalletl3,
      NATIVE_MINT
    );
    console.log("recipientTokenAccount: ", recipientTokenAccount);

    let disburseSplitwaveIx = splitWaveProgram.instruction.disburseSplitwave({
      accounts: {
        authority: testwallet1,
        mint: NATIVE_MINT,
        recipient: testwalletl3,
        splitwave: splitwave,
        splitwaveTokenAccount: splitwaveTokenAccount,
        payer: wallet_t.publicKey,
        recipientTokenAccount: recipientTokenAccount,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
    });
    disburseSplitwaveIxs.push(disburseSplitwaveIx);
    const disburseSplitwaveSignature = await sendTransactions(
      connection,
      wallet,
      [disburseSplitwaveIxs],
      [[]]
    );
    console.log("disburseSplitwaveSignature: ", disburseSplitwaveSignature);
  };

  const updateSplitwave = async () => {
    let wallet_t = wallet as any;
    const updateSplitwaveIxs = [];
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
      SPLITWAVE_IDL,
      SPLITWAVE_ADDRESS,
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
    let splitwaveTokenAccount = await getAssociatedTokenAddress(
      splitwave,
      NATIVE_MINT
    );
    console.log("splitwaveTokenAccount: ", splitwaveTokenAccount);
    let recipientTokenAccount = await getAssociatedTokenAddress(
      testwalletl3,
      NATIVE_MINT
    );
    console.log("recipientTokenAccount: ", recipientTokenAccount);

    let updateSplitwaveIx = splitWaveProgram.instruction.updateSplitwave(
      new BN(2 * LAMPORTS_PER_SOL),
      participants,
      {
        accounts: {
          authority: testwallet1,
          mint: NATIVE_MINT,
          recipient: testwalletl3,
          splitwave: splitwave,
        },
      }
    );
    updateSplitwaveIxs.push(updateSplitwaveIx);
    const updateSplitwaveSignature = await sendTransactions(
      connection,
      wallet,
      [updateSplitwaveIxs],
      [[]]
    );
    console.log("updateSplitwaveSignature: ", updateSplitwaveSignature);
  };

  return (
    <div>
      {wallet && !wallet.connected && (
        <button className="connect-wallet-button" onClick={() => connect()}>
          Connect Wallet
        </button>
      )}
      {publicKey && (
        // {wallet && wallet.connected && (
        <>
          <div className="raffle-header">
            <button
              className="createSplitwave"
              onClick={() => createSplitwave()}
            >
              Create Splitwave
            </button>
            <button className="paySplitwave" onClick={() => paySplitwave()}>
              Pay Splitwave
            </button>
            <button
              className="disburseSplitwave"
              onClick={() => disburseSplitwave()}
            >
              Disburse Splitwave
            </button>
            <button
              className="updateSplitwave"
              onClick={() => updateSplitwave()}
            >
              Update Splitwave
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Splitwave;
