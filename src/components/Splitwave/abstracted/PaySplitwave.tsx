import React, { useCallback, useEffect, useMemo, useState } from "react";


import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";

import { AnchorProvider, Program, BN } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";

import { 
    NATIVE_MINT, 
    TOKEN_PROGRAM_ID, 
    ASSOCIATED_TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddress 
} from "@solana/spl-token";

import * as splitWaveIdl from "../../../idl/splitwave.json";
import { Splitwave as SplitwaveIdlType } from "../splitwave";
import { 
    PendingSplitwaves,
    SEED_SPLITWAVE, 
    SEED_SPLITWAVE_ID, 
    SEED_SPLITWAVE_TREASURY, 
    SPLITWAVE_PROGRAM_ID 
} from "../splitwaveConfig";

const PaySplitwave = () => {
  const { connected, connect, publicKey } = useWallet();
  const wallet = useWallet();

  const connection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl("devnet")
  );
  const [splitwaveId, setSplitwaveId] = useState<string>("");
  // State for holding participant information and other necessary states
  const [pendingSplitwaves, setPendingSplitwaves] = useState<PendingSplitwaves[]>([]);

  const [solAmount, setSolAmount] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const findSplitwaveIdPda = async () => {
    const [splitwaveIdPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_SPLITWAVE_ID)],
      SPLITWAVE_PROGRAM_ID
    );
    return splitwaveIdPda;
  };

  const findSplitwaveTreasuryPda = async (
    splitwavePda: PublicKey
  ): Promise<[PublicKey, number]> => {
    const [splitwaveTreasuryPda, splitwaveTreasuryBump] =
      PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_SPLITWAVE_TREASURY), splitwavePda.toBuffer()],
        SPLITWAVE_PROGRAM_ID
      );
    return [splitwaveTreasuryPda, splitwaveTreasuryBump];
  };
  const findSplitwavePda = async (splitwaveId: BN) => {
    const [splitwavePda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_SPLITWAVE), splitwaveId.toArrayLike(Buffer, "le", 8)],
      SPLITWAVE_PROGRAM_ID
    );
    return splitwavePda;
  };
  const getPendingSplitwaves = useCallback(async () => {
    const maxAttempts = 2;
    let attempts = 0;

    // Try connecting to the wallet up to 'maxAttempts' times
    while (
      (!wallet.connected ||
        !wallet.publicKey ||
        !wallet.wallet) &&
      attempts < maxAttempts
    ) {
      try {
        await wallet.connect();
      } catch (error) {
        console.error("Failed to connect to the wallet:", error);
      }

      attempts++;
    }

    if (!wallet.publicKey){
        return new WalletNotConnectedError();
    }

    const provider = new AnchorProvider(connection, wallet as any, {});

    const splitWaveProgram = new Program<SplitwaveIdlType>(
        splitWaveIdl as any,
        SPLITWAVE_PROGRAM_ID,
        provider
    );

    let splitwaveIdPda = await findSplitwaveIdPda();
    let splitwaveIdPdaAccount =
        await splitWaveProgram.account.splitwaveId.fetch(splitwaveIdPda);
    console.log(
        "splitwaveIdPdaAccount.splitwaveId: ",
        splitwaveIdPdaAccount.splitwaveId.toNumber()
    );
    // get all the splitwave ids till the current splitwaveId
    for (let id = 1; id < splitwaveIdPdaAccount.splitwaveId.toNumber(); id++) {
        // fetch all the splitwave accounts and check if the particpant of all the splitwaves is the wallet address
        const splitwavePda = await findSplitwavePda(new BN(id));
        let splitwave = await splitWaveProgram.account.splitwave.fetch(
            splitwavePda
        );
        // convert this splitwave variable to struct tyep 
        let splitwaveStruct = {
            authority: splitwave.authority,
            recipientTokenAccount: splitwave.recipientTokenAccount,
            splitwaveTreasury: splitwave.splitwaveTreasury,
            splitwaveMint: splitwave.splitwaveMint,
            splitwaveId: splitwave.splitwaveId,
            participants: splitwave.participants,
            splitwaveDisbursed : splitwave.splitwaveDisbursed,
            totalAmountToRecipient: splitwave.totalAmountToRecipient,
            amountPaidToSplitwaveAccount: splitwave.amountPaidToSplitwaveAccount,
            totalParticipants: splitwave.totalParticipants,
            participantsPaidToSplitwave: splitwave.participantsPaidToSplitwave,
        }

        // check if the participants vector by iterating through it and check if it  has wallet address
        setPendingSplitwaves([]);
        for (let i = 0; i < splitwaveStruct.participants.length; i++) {
            if (splitwaveStruct.participants[i].participantTokenAccount.toBase58() === wallet.publicKey.toBase58()) {
                // if the participant is found then check if the splitwave is disbursed or not
                console.log("disbNonDisb splitwaveStruct.splitwaveId.toNumber(): ", splitwaveStruct.splitwaveId.toNumber());
                
                if (!splitwaveStruct.splitwaveDisbursed) {
                console.log("NonDisb splitwaveStruct.splitwaveId.toNumber(): ", splitwaveStruct.splitwaveId.toNumber());

                    if (!splitwaveStruct.participants[i].paid) {
                        // add the splitwave id and amount to the pending splitwaves array
                        let pendingSplitwave: PendingSplitwaves = {
                            splitwaveId: splitwaveStruct.splitwaveId,
                            splitwaveAmount: splitwaveStruct.participants[i].participantSplitAmount,
                        };
                        console.log("pendingSplitwave.splitwaveAmount.toNumber(): ", pendingSplitwave.splitwaveAmount.toNumber());
                        console.log("pendingSplitwave.splitwaveId.toNumber(): ", pendingSplitwave.splitwaveId.toNumber());                        
                        setPendingSplitwaves((prev: PendingSplitwaves[]) => [...prev, pendingSplitwave]);
                    }                
                }
            }
        }
    }
}, [wallet]);

const paySplitwave = useCallback(async (selectedPendingSplitwave: PendingSplitwaves) => {
    const maxAttempts = 2;
    let attempts = 0;

    // Try connecting to the wallet up to 'maxAttempts' times
    while (
      (!wallet.connected ||
        !wallet.publicKey ||
        !wallet.wallet) &&
      attempts < maxAttempts
    ) {
      try {
        await wallet.connect();
      } catch (error) {
        console.error("Failed to connect to the wallet:", error);
      }

      attempts++;
    }

    if (!wallet.publicKey){
        return new WalletNotConnectedError();
    }

    const provider = new AnchorProvider(connection, wallet as any, {});

    const splitWaveProgram = new Program<SplitwaveIdlType>(
        splitWaveIdl as any,
        SPLITWAVE_PROGRAM_ID,
        provider
    );

    
    // define amount variable as react state variable and pass it to the paySplitwave method
    let splitwaveId = selectedPendingSplitwave.splitwaveId;
    let splitwaveAmount = selectedPendingSplitwave.splitwaveAmount;
    let splitwavePda = await findSplitwavePda(splitwaveId);
    let splitwave = await splitWaveProgram.account.splitwave.fetch(
        splitwavePda
    );
    let splitwaveTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        splitwavePda,
        true
    );
    let participantTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        wallet.publicKey,
        true
    );
    let recipientTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        splitwave.recipientTokenAccount,
        true
    );
    console.log("splitwaveTokenAccount: ", splitwaveTokenAccount.toBase58());
    console.log(
        "participantTokenAccount: ",
        participantTokenAccount.toBase58()
    );
    console.log("recipientTokenAccount: ", recipientTokenAccount.toBase58());

    let paySplitwaveIx = await splitWaveProgram.methods
        .paySplitwave(splitwaveAmount)
        .accountsStrict({
        authority: splitwave.authority,
        recipientTokenAccount: splitwave.recipientTokenAccount,
        splitwave: splitwavePda,
        splitwaveTreasury: splitwave.splitwaveTreasury,
        splitwaveMint: NATIVE_MINT,
        participant: wallet.publicKey,
        participantTokenAccount: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([])
        .rpc();
    console.log("paySplitwaveIx: ", paySplitwaveIx);
}, [wallet]);
    const getWalletSolBalance = useCallback(async () => {
        if (
            !connected ||
            !publicKey ||
            !wallet ||
            !wallet.publicKey ||
            !wallet.wallet
        ) {
            throw new WalletNotConnectedError();
        }
        const walletSolBalance = await connection.getBalance(publicKey);
        console.log("walletBalance: ", walletSolBalance);
        setWalletAddress(publicKey.toBase58());
        setSolAmount(walletSolBalance / LAMPORTS_PER_SOL);
    }, [connected, publicKey, wallet]);

    useEffect(() => {
        getWalletSolBalance();
        getPendingSplitwaves();
      }, [publicKey, connected, getWalletSolBalance, getPendingSplitwaves]);
    // Use React.memo to memoize SplitwaveItem component
    const SplitwaveItem = ({ pendingSplitwave }: { pendingSplitwave: PendingSplitwaves }) => (
        <div className="splitwave-item">
          <div>
            <span className="item-label">Splitwave Id:</span>{" "}
            {pendingSplitwave.splitwaveId?.toNumber()}
          </div>
          <div>
            <span className="item-label">Amount:</span>{" "}
            {pendingSplitwave.splitwaveAmount?.toNumber() / LAMPORTS_PER_SOL} SOL
          </div>
          <div>
            <button className="pay-button" onClick={() => paySplitwave(pendingSplitwave)}>
              Pay
            </button>
          </div>
        </div>
      );
            
      return (
        <div className="pay-splitwave-container">
            
          {pendingSplitwaves.length > 0 && (
            <>
              <h2 className="participants-heading">Participants {pendingSplitwaves.length}</h2>
              {pendingSplitwaves.map((pendingSplitwave: PendingSplitwaves, index) => (
                <SplitwaveItem pendingSplitwave={pendingSplitwave} key={index} />
              ))}
            </>
          )}
        </div>
      );
    };
    export default PaySplitwave;