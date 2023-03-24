import * as anchor from "projectSerumAnchor0260";

import { AnchorProvider, BN, Program } from "projectSerumAnchor0260";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import * as splitWaveIdl from "./../../idl/splitwave.json";
import { Splitwave as SplitwaveIdlType } from "./splitwave";
import {
  SEED_SPLITWAVE,
  SEED_SPLITWAVE_ID,
  SPLITWAVE_PROGRAM_ID,
  ZzZ1,
  ZzZ2,
  zzz3,
  Zzz4,
  zzZ5,
} from "./splitwaveConfig";
import {
  Account,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "solanaSPLToken037";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { sendTransactions } from "../../config/connection";
import { useEffect, useState } from "react";

const Splitwave = () => {
  const { connected, connect, publicKey } = useWallet();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  // const connection = new anchor.web3.Connection("http://localhost:8899");
  const connection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl("devnet")
  );

  const [splitwaveAmount, setSplitwaveAmount] = useState<number>(0);
  const [solAmount, setSolAmount] = useState<number>(0);
  const [wrappedSolAmount, setWrappedSolAmount] = useState<number>(0);
  const [solToWrap, setSolToWrap] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSplitwaveAmount(Number(event.target.value));
  };
  const findSplitwaveIdPda = async () => {
    const [splitwaveIdPda] = await PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_SPLITWAVE_ID)],
      SPLITWAVE_PROGRAM_ID
    );
    return splitwaveIdPda;
  };

  const findSplitwavePda = async (splitwaveId: BN) => {
    // const findSplitwavePda = async (splitwaveId: number) => {
    // const [splitwavePda] = await PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from(SEED_SPLITWAVE),
    //     Buffer.from(splitwaveId.toArrayLike(Buffer, "le")),
    //     // Buffer.from(splitwaveId.toArrayLike(Buffer)),
    //   ],
    //   // [Buffer.from(SEED_SPLITWAVE), Buffer.from(splitwaveId.toString())],
    //   SPLITWAVE_PROGRAM_ID
    // );

    const [splitwavePda, _] = await PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_SPLITWAVE), splitwaveId.toArrayLike(Buffer, "le", 8)],
      SPLITWAVE_PROGRAM_ID
    );
    return splitwavePda;
  };

  const createSplitwaveId = async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet ||
      !wallet.publicKey ||
      !wallet.wallet
    ) {
      throw new WalletNotConnectedError();
    }
    let wallet_t = wallet as any;
    const provider = new AnchorProvider(connection, wallet_t, {});
    const splitWaveProgram = new Program<SplitwaveIdlType>(
      splitWaveIdl as any,
      SPLITWAVE_PROGRAM_ID,
      provider
    );
    const splitwaveIdPda = await findSplitwaveIdPda();

    let createSplitwaveIdIx = await splitWaveProgram.methods
      .createSplitwaveId()
      .accountsStrict({
        splitwaveId: splitwaveIdPda,
        systemProgram: anchor.web3.SystemProgram.programId,
        payer: wallet.publicKey,
      })
      .signers([])
      .rpc();
    console.log("createSplitwaveIdIx: ", createSplitwaveIdIx);
  };

  const createSplitwave = async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet ||
      !wallet.publicKey ||
      !wallet.wallet
    ) {
      throw new WalletNotConnectedError();
    }
    let wallet_t = wallet as any;

    const provider = new AnchorProvider(connection, wallet_t, {});

    const splitWaveProgram = new Program<SplitwaveIdlType>(
      splitWaveIdl as any,
      SPLITWAVE_PROGRAM_ID,
      provider
    );

    let participants = [
      {
        split: new BN(0.5 * LAMPORTS_PER_SOL),
        paid: false,
        participant: ZzZ2,
      },
      {
        split: new BN(0.3 * LAMPORTS_PER_SOL),
        paid: false,
        participant: zzz3,
      },
      {
        split: new BN(0.2 * LAMPORTS_PER_SOL),
        paid: false,
        participant: Zzz4,
      },
    ];

    const splitwaveIdPda = await findSplitwaveIdPda();
    console.log("splitwaveIdPda: ", splitwaveIdPda.toBase58());

    const splitwaveIdPdaAccount =
      await splitWaveProgram.account.splitwaveId.fetch(splitwaveIdPda);
    console.log("splitwaveIdPdaAccount: ", splitwaveIdPdaAccount);
    let splitwaveId = splitwaveIdPdaAccount.splitwaveId;
    // console.log("splitwaveId Buffer: ", splitwaveId.toBuffer());
    console.log("splitwaveId String: ", splitwaveId.toString());

    const splitwavePda = await findSplitwavePda(splitwaveId);

    console.log("splitwavePda: ", splitwavePda.toBase58());
    // let splitwaveTokenAccount = await getAssociatedTokenAddress(
    //   splitwavePda,
    //   NATIVE_MINT
    // );

    let createSplitwaveIx = await splitWaveProgram.methods
      .createSplitwave(new BN(1 * LAMPORTS_PER_SOL), participants)
      .accountsStrict({
        authority: wallet.publicKey,
        mint: NATIVE_MINT,
        recipient: zzZ5,
        splitwave: splitwavePda,
        splitwaveId: splitwaveIdPda,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([])
      .rpc();
    console.log("createSplitwaveIx: ", createSplitwaveIx);

    // let createSplitwaveTx: any = [];
    // createSplitwaveTx.push(
    //   splitWaveProgram.instruction.createSplitwave(new BN(10), participants, {
    //     // splitWaveProgram.instruction.createSplitwave(new BN(10), {
    //     accounts: {
    //       authority: wallet.publicKey,
    //       mint: NATIVE_MINT,
    //       recipient: zzZ5,
    //       splitwave: splitwavePda,
    //       // splitwaveTokenAccount: splitwaveTokenAccount,
    //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //     },
    //   })
    // );
    // console.log("createSplitwaveTx: ", createSplitwaveTx);
    // const ifaSig = await sendTransactions(
    //   connection,
    //   wallet_t,
    //   [createSplitwaveTx],
    //   [[]]
    // );
    // console.log("ifaSig: ", ifaSig);
  };

  const paySplitwave = async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet ||
      !wallet.publicKey ||
      !wallet.wallet
    ) {
      throw new WalletNotConnectedError();
    }
    let wallet_t = wallet as any;

    const provider = new AnchorProvider(connection, wallet_t, {});

    const splitWaveProgram = new Program<SplitwaveIdlType>(
      splitWaveIdl as any,
      SPLITWAVE_PROGRAM_ID,
      provider
    );

    const splitwaveIdPda = await findSplitwaveIdPda();
    const splitwaveIdPdaAccount =
      await splitWaveProgram.account.splitwaveId.fetch(splitwaveIdPda);
    // let splitwaveId = splitwaveIdPdaAccount.splitwaveId;
    // const splitwavePda = await findSplitwavePda(splitwaveId);

    let id = new BN(2);
    const splitwavePda = await findSplitwavePda(id);
    // const splitwavePda = await findSplitwavePda(splitwaveId.toNumber());

    //fetch the splitwave account
    let splitwave = await splitWaveProgram.account.splitwave.fetch(
      splitwavePda
    );
    console.log("splitwave: ", splitwave);
    console.log(
      "splitwave.authority.toBase58(): ",
      splitwave.authority.toBase58()
    );

    let splitwaveTokenAccount = await getAssociatedTokenAddress(
      splitwavePda,
      NATIVE_MINT
    );

    let participantTokenAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      wallet.publicKey
    );

    let recipientTokenAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      zzZ5
    );

    // let paySplitwaveTx: any = [];

    // get the associated token account for the participant using getAccount method and if doesn't exist, create it
    let participantTokenAccountInfo: Account;
    try {
      participantTokenAccountInfo = await getAccount(
        connection,
        recipientTokenAccount
      );
    } catch (err) {
      console.log("participantTokenAccountInfo error: ", err);
      let createParticipantTokenAccountTx = new Transaction();
      let createParticipantTokenAccountIx: anchor.web3.TransactionInstruction;
      createParticipantTokenAccountIx =
        await createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          participantTokenAccount,
          wallet.publicKey,
          NATIVE_MINT
        );
      createParticipantTokenAccountTx.add(createParticipantTokenAccountIx);
      let cptaTxSig = await wallet.sendTransaction(
        createParticipantTokenAccountTx,
        connection
      );
      console.log("cptaTxSig: ", cptaTxSig);
      // get the confirmed transaction
      let cptaTx = await connection.getParsedTransaction(
        cptaTxSig,
        "confirmed"
      );
      console.log("cptaTx: ", cptaTx);
    }

    // get the associated token account for the recipient using getAccount method and if doesn't exist, create it
    let recipientTokenAccountInfo: Account;
    try {
      recipientTokenAccountInfo = await getAccount(
        connection,
        recipientTokenAccount
      );
    } catch (err) {
      console.log("recipientTokenAccountInfo error: ", err);
      let createRecipientTokenAccountTx = new Transaction();
      let createRecipientTokenAccountIx: anchor.web3.TransactionInstruction;
      createRecipientTokenAccountIx =
        await createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          recipientTokenAccount,
          splitwave.recipient,
          NATIVE_MINT
        );
      createRecipientTokenAccountTx.add(createRecipientTokenAccountIx);
      let crtaTxSig = await wallet.sendTransaction(
        createRecipientTokenAccountTx,
        connection
      );
      console.log("crtaTxSig: ", crtaTxSig);
      // get the confirmed transaction
      let crtaTx = await connection.getParsedTransaction(
        crtaTxSig,
        "confirmed"
      );
      console.log("crtaTx: ", crtaTx);
    }

    // get the associated token account for the splitwave using getAccount method and if doesn't exist, create it
    let splitwaveTokenAccountInfo: Account;
    try {
      splitwaveTokenAccountInfo = await getAccount(
        connection,
        splitwaveTokenAccount
      );
    } catch (err) {
      console.log("splitwaveTokenAccountInfo error: ", err);
      let createSplitwaveTokenAccountTx = new Transaction();

      let createSplitwaveTokenAccountIx: anchor.web3.TransactionInstruction;
      createSplitwaveTokenAccountIx =
        await createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          splitwaveTokenAccount,
          splitwavePda,
          NATIVE_MINT
        );
      createSplitwaveTokenAccountTx.add(createSplitwaveTokenAccountIx);
      let csttaTxSig = await wallet.sendTransaction(
        createSplitwaveTokenAccountTx,
        connection
      );
      console.log("csttaTxSig: ", csttaTxSig);
      // get the confirmed transaction
      let csttaTx = await connection.getParsedTransaction(
        csttaTxSig,
        "confirmed"
      );
      console.log("csttaTx: ", csttaTx);
    }

    // paySplitwaveTx.push(createParticipantTokenAccountIx);
    console.log("authority: ", splitwave.authority.toBase58());
    console.log("mint: ", NATIVE_MINT.toBase58());
    console.log("recipient: ", splitwave.recipient.toBase58());
    console.log("splitwave: ", splitwavePda.toBase58());
    console.log("splitwaveTokenAccount: ", splitwaveTokenAccount.toBase58());
    console.log("participant: ", wallet.publicKey.toBase58());
    console.log(
      "participantTokenAccount: ",
      participantTokenAccount.toBase58()
    );
    console.log("rent: ", anchor.web3.SYSVAR_RENT_PUBKEY.toBase58());
    console.log(
      "systemProgram: ",
      anchor.web3.SystemProgram.programId.toBase58()
    );
    console.log("tokenProgram: ", TOKEN_PROGRAM_ID.toBase58());
    console.log(
      "associatedTokenProgram: ",
      ASSOCIATED_TOKEN_PROGRAM_ID.toBase58()
    );

    // define amount variable as react state variable and pass it to the paySplitwave method

    let paySplitwaveIx = await splitWaveProgram.methods
      .paySplitwave(new BN(splitwaveAmount * LAMPORTS_PER_SOL))
      .accountsStrict({
        authority: splitwave.authority,
        mint: NATIVE_MINT,
        recipient: splitwave.recipient,
        recipientTokenAccount: recipientTokenAccount,
        splitwave: splitwavePda,
        splitwaveTokenAccount: splitwaveTokenAccount,
        participant: wallet.publicKey,
        participantTokenAccount: participantTokenAccount,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([])
      .rpc();
    console.log("paySplitwaveIx: ", paySplitwaveIx);

    /*
       MethodsBuilder<SplitwaveIdlType, {
        name: "paySplitwave";
        accounts: [{
            name: "authority";
            isMut: false;
            isSigner: false;
        }, {
            name: "mint";
            isMut: false;
            isSigner: false;
        }, {
            name: "recipient";
            isMut: false;
            isSigner: false;
        }, ... 7 more ..., {
            ...;
        }];
        args: [...];
    } & {
        ...;
    }>
    */

    // Make an instruction with the object returned by paySplitwaveIx which is in the above mentioned format

    // paySplitwaveTx.push(
    //   splitWaveProgram.instruction.paySplitwave(
    //     new BN(0.5 * LAMPORTS_PER_SOL),
    //     {
    //       accounts: {
    //         authority: splitwave.authority,
    //         mint: NATIVE_MINT,
    //         recipient: splitwave.recipient,
    //         splitwave: splitwavePda,
    //         splitwaveTokenAccount: splitwaveTokenAccount,
    //         participant: wallet.publicKey,
    //         participantTokenAccount: participantTokenAccount,
    //         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    //         systemProgram: anchor.web3.SystemProgram.programId,
    //         tokenProgram: TOKEN_PROGRAM_ID,
    //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //       },
    //     }
    //   )
    // );
    // console.log("paySplitwaveTx: ", paySplitwaveTx);
    // const psSig = await sendTransactions(
    //   connection,
    //   wallet_t,
    //   [paySplitwaveTx],
    //   [[]]
    // );
    // console.log("psSig: ", psSig);
  };

  // const disburseSplitwave = async () => {
  //   let wallet_t = wallet as any;
  //   const disburse_splitwave_ixs = [];
  //   const provider = new AnchorProvider(connection, wallet_t, {});
  //   const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
  //     splitWaveIdl,
  //     splitWaveIdl.metadata.address,
  //     provider
  //   );
  //   const splitwave = await findSplitwavePda(
  //     testwallet1,
  //     NATIVE_MINT,
  //     testwalletl3
  //   );
  //   console.log("splitwave: ", splitwave);
  //   let splitwaveTokenAccount = await getAssociatedTokenAddress(
  //     splitwave,
  //     NATIVE_MINT
  //   );
  //   console.log("splitwaveTokenAccount: ", splitwaveTokenAccount);
  //   let recipient_token_account = await getAssociatedTokenAddress(
  //     testwalletl3,
  //     NATIVE_MINT
  //   );
  //   console.log("recipient_token_account: ", recipient_token_account);

  //   let disburse_splitwave_ix = splitWaveProgram.instruction.disburseSplitwave({
  //     accounts: {
  //       authority: testwallet1,
  //       mint: NATIVE_MINT,
  //       splitwave: splitwave,
  //       splitwaveTokenAccount: splitwaveTokenAccount,
  //       recipient: testwalletl3,
  //       recipient_token_account: recipient_token_account,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     },
  //   });
  //   disburse_splitwave_ixs.push(disburse_splitwave_ix);
  //   const tx = await wallet_t.signTransaction({
  //     feePayer: wallet_t.publicKey,
  //     instructions: disburse_splitwave_ixs,
  //   });
  //   const txid = await connection.sendRawTransaction(tx.serialize());
  //   console.log("txid: ", txid);
  // };

  // const updateSplitwave = async () => {
  //   let wallet_t = wallet as any;
  //   const update_splitwave_ixs = [];
  //   const provider = new AnchorProvider(connection, wallet_t, {});
  //   const splitWaveProgram = new Program<SPLITWAVE_TYPES.splitWaveIdl>(
  //     splitWaveIdl,
  //     splitWaveIdl.metadata.address,
  //     provider
  //   );
  //   const splitwave = await findSplitwavePda(
  //     testwallet1,
  //     NATIVE_MINT,
  //     testwalletl3
  //   );
  //   console.log("splitwave: ", splitwave);
  //   let participants = [
  //     {
  //       split: new BN(1 * LAMPORTS_PER_SOL),
  //       paid: false,
  //       participant: testwallet1,
  //     },
  //     {
  //       split: new BN(0.6 * LAMPORTS_PER_SOL),
  //       paid: false,
  //       participant: testwallet2,
  //     },
  //     {
  //       split: new BN(0.4 * LAMPORTS_PER_SOL),
  //       paid: false,
  //       participant: testwalletm3,
  //     },
  //   ];
  //   let splitwaveTokenAccount = await getAssociatedTokenAddress(
  //     splitwave,
  //     NATIVE_MINT
  //   );
  //   console.log("splitwaveTokenAccount: ", splitwaveTokenAccount);
  //   let recipient_token_account = await getAssociatedTokenAddress(
  //     testwalletl3,
  //     NATIVE_MINT
  //   );
  //   console.log("recipient_token_account: ", recipient_token_account);

  //   let update_splitwave_ix = splitWaveProgram.instruction.updateSplitwave(
  //     new BN(2 * LAMPORTS_PER_SOL),
  //     participants,
  //     {
  //       accounts: {
  //         authority: testwallet1,
  //         mint: NATIVE_MINT,
  //         splitwave: splitwave,
  //         splitwaveTokenAccount: splitwaveTokenAccount,
  //         recipient: testwalletl3,
  //         recipient_token_account: recipient_token_account,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       },
  //     }
  //   );
  //   update_splitwave_ixs.push(update_splitwave_ix);
  //   const tx = await wallet_t.signTransaction({
  //     feePayer: wallet_t.publicKey,
  //     instructions: update_splitwave_ixs,
  //   });
  //   const txid = await connection.sendRawTransaction(tx.serialize());
  //   console.log("txid: ", txid);
  // };

  const convertSolToWrappedSol = async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet ||
      !wallet.publicKey ||
      !wallet.wallet
    ) {
      throw new WalletNotConnectedError();
    }

    const associatedTokenAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      wallet.publicKey
    );

    // Create token account to hold your wrapped SOL only if it doesn't exist
    let ataAccountInfo;
    let ataTransaction = new Transaction();
    try {
      ataAccountInfo = await connection.getAccountInfo(associatedTokenAccount);
    } catch (e) {
      ataTransaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAccount,
          wallet.publicKey,
          NATIVE_MINT
        )
      );
    }

    ataTransaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: associatedTokenAccount,
        lamports: solToWrap * LAMPORTS_PER_SOL,
      }),
      createSyncNativeInstruction(associatedTokenAccount)
    );
    let ataTxSig = await wallet.sendTransaction(ataTransaction, connection);
    console.log("ataTxSig: ", ataTxSig);
    let cnfrmTx = await connection.confirmTransaction(ataTxSig, "processed");
    if (cnfrmTx.value.err === null) {
      console.log("cnfrmTx: ", cnfrmTx);
      getWalletSolBalance();
      getWalletWrappedSolBalance();
    }
  };

  const getWalletSolBalance = async () => {
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
  };

  const getWalletWrappedSolBalance = async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet ||
      !wallet.publicKey ||
      !wallet.wallet
    ) {
      throw new WalletNotConnectedError();
    }
    const associatedTokenAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      wallet.publicKey
    );

    let accountInfo;
    let ataTransaction = new Transaction();

    try {
      accountInfo = await getAccount(connection, associatedTokenAccount);

      console.log(
        `Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`
      );
      setWrappedSolAmount(Number(accountInfo.amount) / LAMPORTS_PER_SOL);
    } catch (e) {
      ataTransaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAccount,
          wallet.publicKey,
          NATIVE_MINT
        )
      );
      let ataTxSig = await wallet.sendTransaction(ataTransaction, connection);
      console.log("ataTxSig: ", ataTxSig);
      let cnfrmTx = await connection.confirmTransaction(ataTxSig, "processed");
      if (cnfrmTx.value.err === null) {
        console.log("cnfrmTx: ", cnfrmTx);
        getWalletSolBalance();
        getWalletWrappedSolBalance();
      }
    }
  };

  const handleWrapAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = parseFloat(event.target.value);
    setSolToWrap(inputValue);
    if (inputValue >= solAmount && inputValue <= 0) {
      throw new Error("Invalid amount to wrap");
    }
  };
  useEffect(() => {
    // Call the getWalletBalance function on component mount to fetch the wallet balance
    getWalletSolBalance();
    getWalletWrappedSolBalance();
  }, [publicKey, connected]);
  return (
    <div style={{ backgroundColor: "white" }}>
      {!wallet && !publicKey && !connected && (
        <button className="connect-wallet-button" onClick={() => connect()}>
          Connect Wallet
        </button>
      )}
      {publicKey && connected && (
        <>
          <div className="raffle-header">
            <h2>Wallet Address</h2>
            <p>{walletAddress}</p>
            <h2>Wallet Balance</h2>
            <p>{solAmount.toFixed(2)} SOL</p>

            <h2>Wrap SOL</h2>
            <p>{wrappedSolAmount.toFixed(2)} WSOL</p>

            <input
              type="number"
              value={solToWrap}
              onChange={handleWrapAmountChange}
              min="0"
              max={solAmount}
              step="0.01"
            />
            <button onClick={() => convertSolToWrappedSol()}>Wrap SOL</button>
            <button
              className="createSplitwaveId"
              onClick={() => createSplitwaveId()}
            >
              Create Splitwave Id
            </button>
            <button
              className="createSplitwave"
              onClick={() => createSplitwave()}
            >
              Create Splitwave
            </button>
            <h2>Amount: {splitwaveAmount}</h2>
            <input
              type="number"
              value={splitwaveAmount}
              onChange={handleAmountChange}
            />
            <button className="paySplitwave" onClick={() => paySplitwave()}>
              Pay Splitwave
            </button>
            {/* <button
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
            </button> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Splitwave;
