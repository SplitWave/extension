import { useCallback, useEffect, useMemo, useState } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from './CreateSplitwave.module.css';

import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";

import {
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";

import * as splitWaveIdl from "../../../idl/splitwave.json";
import { Splitwave as SplitwaveIdlType } from "../splitwave";
import {
  MintAddressSymbols,
  NewParticipant,
  SEED_SPLITWAVE,
  SEED_SPLITWAVE_ID,
  SEED_SPLITWAVE_TREASURY,
  SplitParticipant,
  SPLITWAVE_PROGRAM_ID,
  ZzZ1,
  ZzZ2,
  zzz3,
  Zzz4,
  zzZ5,
} from "../splitwaveConfig";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { Tab } from "@mui/material";

const CreateSplitwave = () => {
  const { connected, publicKey , wallet, connect } = useWallet();
  // const wallet = useWallet();

  const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
  const connection = useMemo(() => {
    return new Connection(DEVNET_RPC_URL, 'recent');
  }, []);


  const [splitwaveIdExists, setSplitwaveIdExists] = useState<boolean>(false);
  const [splitwaveId, setSplitwaveId] = useState<BN>(new BN(0));
  
  const splitwaveSupportedTokens = useMemo(() => [
    { symbol: "SOL", mintAddress: NATIVE_MINT},
    { symbol: "USDC", mintAddress: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") },
    { symbol: "SRM", mintAddress: new PublicKey("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt") },
    { symbol: "RAY", mintAddress: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R") },
    // Add more tokens as needed
  ], []);
  
  const [splitwaveMint, setSplitwaveMint] = useState<PublicKey | undefined>(undefined);
  
  const handleSelectSplitwaveSupportedToken = useCallback(async (event) => {
    if (!event.target.value) {
      setSplitwaveMint(undefined);
      return;
    }
    setSplitwaveTotalAmount(0);

    setSelectedTokenSymbol(event.target.value);
    let token: MintAddressSymbols = splitwaveSupportedTokens[0];
    // find the token from the list of popular tokens
    splitwaveSupportedTokens.forEach((splitwaveSupportedToken) => {
      if (splitwaveSupportedToken.symbol === event.target.value) {
        token = splitwaveSupportedToken;
      }
    });
    console.log("token: ", token);
    console.log("token.mintAddress: ", token.mintAddress.toBase58());
    setSplitwaveMint(token.mintAddress);
  },
  [splitwaveSupportedTokens]);

  const [splitwaveTotalAmount, setSplitwaveTotalAmount] = useState<number>(0);
  const [totalAmountToRecipient, setTotalAmountToRecipient] = useState<BN>(new BN(0));
  const [splitwaveAmountDecimals, setSplitwaveAmountDecimals] = useState<number>(0);
  const handleTotalAmountChange = useCallback(async (event) => {
    // if the event.target.value is not a number set the recipent address to null
    if (isNaN(Number(event.target.value))){
      
      setSplitwaveTotalAmount(0);
      setTotalAmountToRecipient(new BN(0));
      setSplitwaveAmountDecimals(0);
      // throw new Error("event.target.value is not a number");

    }
      if (!connection ||  splitwaveMint === undefined)
      {
        throw new Error("connection or splitwaveMint is undefined");
      }
      setSplitwaveTotalAmount(event.target.value);
      if (splitwaveMint === NATIVE_MINT)
      {
        setSplitwaveAmountDecimals(9);
        setTotalAmountToRecipient(new BN(event.target.value).mul(new BN(10).pow(new BN(9))));
      }
      else
      {
        const mintInfo = await getMint(connection, splitwaveMint);
        setSplitwaveAmountDecimals(mintInfo.decimals);
        setTotalAmountToRecipient(new BN(event.target.value).mul(new BN(10).pow(new BN(mintInfo.decimals))));
      }
    }, [connection, splitwaveMint]);
  
  const [walletSolBalance, setWalletSolBalance] = useState<number>(0);
  const [ZzZ1SolBalance, setZzZ1SolBalance] = useState<number>(0);
  const [ZzZ2SolBalance, setZzZ2SolBalance] = useState<number>(0);
  const [zzz3SolBalance, setzzz3SolBalance] = useState<number>(0);
  const [Zzz4SolBalance, setZzz4SolBalance] = useState<number>(0);
  const [zzZ5SolBalance, setzzZ5SolBalance] = useState<number>(0);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>("");
  
  const [walletAssociatedTokenAddress, setWalletAssociatedTokenAddress] = useState<PublicKey>();
  const [ZzZ1AssociatedTokenAddress, setZzZ1AssociatedTokenAddress] = useState<PublicKey>();
  const [ZzZ2AssociatedTokenAddress, setZzZ2AssociatedTokenAddress] = useState<PublicKey>();
  const [zzz3AssociatedTokenAddress, setzzz3AssociatedTokenAddress] = useState<PublicKey>();
  const [Zzz4AssociatedTokenAddress, setZzz4AssociatedTokenAddress] = useState<PublicKey>();
  const [zzZ5AssociatedTokenAddress, setzzZ5AssociatedTokenAddress] = useState<PublicKey>();
  const [walletAssociatedTokenAddressBalance, setWalletAssociatedTokenAddressBalance] = useState<number>(0);
  const [ZzZ1AssociatedTokenAddressBalance, setZzZ1AssociatedTokenAddressBalance] = useState<number>(0);
  const [ZzZ2AssociatedTokenAddressBalance, setZzZ2AssociatedTokenAddressBalance] = useState<number>(0);
  const [zzz3AssociatedTokenAddressBalance, setzzz3AssociatedTokenAddressBalance] = useState<number>(0);
  const [Zzz4AssociatedTokenAddressBalance, setZzz4AssociatedTokenAddressBalance] = useState<number>(0);
  const [zzZ5AssociatedTokenAddressBalance, setzzZ5AssociatedTokenAddressBalance] = useState<number>(0);

  const getMintDecimals = async(connection: Connection, mintAddress: PublicKey) => {
    const mintInfo = await getMint(
      connection,
      mintAddress,
    );

    console.log("mintInfo", mintInfo);
    console.log("mintInfo.decimals",mintInfo.decimals);
    return mintInfo.decimals;
  }

  const getWalletSolBalance = useCallback(async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet
    ) {
      throw new WalletNotConnectedError();
    }
    const walletSolBalance = await connection.getBalance(publicKey);
    const ZzZ1SolBalance = await connection.getBalance(ZzZ1);
    const ZzZ2SolBalance = await connection.getBalance(ZzZ2);
    const zzz3SolBalance = await connection.getBalance(zzz3);
    const Zzz4SolBalance = await connection.getBalance(Zzz4);
    const zzZ5SolBalance = await connection.getBalance(zzZ5);
    console.log("walletBalance: ", walletSolBalance);
    setWalletSolBalance(walletSolBalance / LAMPORTS_PER_SOL);
    setZzZ1SolBalance(ZzZ1SolBalance / LAMPORTS_PER_SOL);
    setZzZ2SolBalance(ZzZ2SolBalance / LAMPORTS_PER_SOL);
    setzzz3SolBalance(zzz3SolBalance / LAMPORTS_PER_SOL);
    setZzz4SolBalance(Zzz4SolBalance / LAMPORTS_PER_SOL);
    setzzZ5SolBalance(zzZ5SolBalance / LAMPORTS_PER_SOL);
  },[connected, publicKey, wallet, connection]);

  const getWalletTokenBalance = useCallback(async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet
    ) {
      throw new WalletNotConnectedError();
    }
    if (splitwaveMint === undefined ) {
      throw new Error("Splitwave mint not found");
    }

    try {
      const walletAssociatedTokenAddress = await getAssociatedTokenAddress(
        splitwaveMint,
        publicKey,
        false,
      );
      const ZzZ1AssociatedTokenAddress = await getAssociatedTokenAddress(
        splitwaveMint,
        ZzZ1,
        false,
      );
      const ZzZ2AssociatedTokenAddress = await getAssociatedTokenAddress(
        splitwaveMint,
        ZzZ2,
        false,
      );
      const zzz3AssociatedTokenAddress = await getAssociatedTokenAddress(
        splitwaveMint,
        zzz3,
        false,
      );
      const Zzz4AssociatedTokenAddress = await getAssociatedTokenAddress(
        splitwaveMint,
        Zzz4,
        false,
      );
      const zzZ5AssociatedTokenAddress = await getAssociatedTokenAddress(
        splitwaveMint,
        zzZ5,
        false,
      );
      const walletAssociatedTokenAddressBalance = await connection.getTokenAccountBalance(
        walletAssociatedTokenAddress,
      );
      const ZzZ1AssociatedTokenAddressBalance = await connection.getTokenAccountBalance(
        ZzZ1AssociatedTokenAddress,
      );
      const ZzZ2AssociatedTokenAddressBalance = await connection.getTokenAccountBalance(
        ZzZ2AssociatedTokenAddress,
      );
      const zzz3AssociatedTokenAddressBalance = await connection.getTokenAccountBalance(
        zzz3AssociatedTokenAddress,
      );
        
      const Zzz4AssociatedTokenAddressBalance = await connection.getTokenAccountBalance(
        Zzz4AssociatedTokenAddress,
      );
      const zzZ5AssociatedTokenAddressBalance = await connection.getTokenAccountBalance(
        zzZ5AssociatedTokenAddress,
      );
      // setSplitwaveMint(splitwaveMint);
      // console.log("splitwaveMint", splitwaveMint.toBase58());
      if (walletAssociatedTokenAddressBalance.value.uiAmount === 0) {
        setSplitwaveTotalAmount(0);
      }
      console.log("walletAssociatedTokenAddressBalance: ", walletAssociatedTokenAddressBalance.value.amount);
      console.log("ZzZ1AssociatedTokenAddressBalance: ", ZzZ1AssociatedTokenAddressBalance.value.amount);
      console.log("ZzZ2AssociatedTokenAddressBalance: ", ZzZ2AssociatedTokenAddressBalance.value.amount);
      console.log("zzz3AssociatedTokenAddressBalance: ", zzz3AssociatedTokenAddressBalance.value.amount);
      console.log("Zzz4AssociatedTokenAddressBalance: ", Zzz4AssociatedTokenAddressBalance.value.amount);
      console.log("zzZ5AssociatedTokenAddressBalance: ", zzZ5AssociatedTokenAddressBalance.value.amount);
      
      
      setWalletAssociatedTokenAddress(walletAssociatedTokenAddress);
      setZzZ1AssociatedTokenAddress(ZzZ1AssociatedTokenAddress);
      setZzZ2AssociatedTokenAddress(ZzZ2AssociatedTokenAddress);
      setzzz3AssociatedTokenAddress(zzz3AssociatedTokenAddress);
      setZzz4AssociatedTokenAddress(Zzz4AssociatedTokenAddress);
      setzzZ5AssociatedTokenAddress(zzZ5AssociatedTokenAddress);
      if (walletAssociatedTokenAddressBalance.value.uiAmount != null)
      {
        setWalletAssociatedTokenAddressBalance(walletAssociatedTokenAddressBalance.value.uiAmount);
      }
      else{
        setWalletAssociatedTokenAddressBalance(0);
        setSplitwaveTotalAmount(0);
      }
      if (ZzZ1AssociatedTokenAddressBalance.value.uiAmount != null)
      {
        setZzZ1AssociatedTokenAddressBalance(ZzZ1AssociatedTokenAddressBalance.value.uiAmount);
      }
      else{
        setZzZ1AssociatedTokenAddressBalance(0);
      }
      if (ZzZ2AssociatedTokenAddressBalance.value.uiAmount != null)
      {
        setZzZ2AssociatedTokenAddressBalance(ZzZ2AssociatedTokenAddressBalance.value.uiAmount);
      }
      else{
        setZzZ2AssociatedTokenAddressBalance(0);
      }
      if (zzz3AssociatedTokenAddressBalance.value.uiAmount != null)
      {
        setzzz3AssociatedTokenAddressBalance(zzz3AssociatedTokenAddressBalance.value.uiAmount);
      }
      else{
        setzzz3AssociatedTokenAddressBalance(0);
      }
      if (Zzz4AssociatedTokenAddressBalance.value.uiAmount != null)
      {
        setZzz4AssociatedTokenAddressBalance(Zzz4AssociatedTokenAddressBalance.value.uiAmount);
      }
      else{
        setZzz4AssociatedTokenAddressBalance(0);
      }
      if (zzZ5AssociatedTokenAddressBalance.value.uiAmount != null)
      {
        setzzZ5AssociatedTokenAddressBalance(zzZ5AssociatedTokenAddressBalance.value.uiAmount);
      }
      else{
        setzzZ5AssociatedTokenAddressBalance(0);
      }
    } catch (error) {
      setWalletSolBalance(0);
      setZzZ1SolBalance(0);
      setZzZ2SolBalance(0);
      setzzz3SolBalance(0);
      setZzz4SolBalance(0);
      setzzZ5SolBalance(0);
      setWalletAssociatedTokenAddressBalance(0);
      setZzZ1AssociatedTokenAddressBalance(0);
      setZzZ2AssociatedTokenAddressBalance(0);
      setzzz3AssociatedTokenAddressBalance(0);
      setZzz4AssociatedTokenAddressBalance(0);
      setzzZ5AssociatedTokenAddressBalance(0);

      console.error(`Error fetching token balance`);
    }
  },[connected, publicKey, wallet, splitwaveMint, connection]);
  
  useEffect(() => {
    // check if splitwaveMint is present in the splitwaveSupportedTokens array
    // find the token from the list of popular tokens
    if (selectedTokenSymbol == "") {
      setSelectedTokenSymbol(splitwaveSupportedTokens[0].symbol);
      setSplitwaveMint(splitwaveSupportedTokens[0].mintAddress);
    }
    splitwaveSupportedTokens.forEach((splitwaveSupportedToken) => {
      if (splitwaveSupportedToken.mintAddress.toBase58() === splitwaveMint?.toBase58()) {

        if (splitwaveMint !== undefined) {
          console.log("splitwaveMint: ", splitwaveMint.toBase58());
          if (splitwaveMint.toBase58() === NATIVE_MINT.toBase58()) {
            getWalletSolBalance();
          } else {
            getWalletTokenBalance();
          }
        }
        else{
          setWalletSolBalance(0);
          setZzZ1SolBalance(0);
          setZzZ2SolBalance(0);
          setzzz3SolBalance(0);
          setZzz4SolBalance(0);
          setzzZ5SolBalance(0);
          setWalletAssociatedTokenAddressBalance(0);
          setZzZ1AssociatedTokenAddressBalance(0);
          setZzZ2AssociatedTokenAddressBalance(0);
          setzzz3AssociatedTokenAddressBalance(0);
          setZzz4AssociatedTokenAddressBalance(0);
          setzzZ5AssociatedTokenAddressBalance(0);
        }
      }
    });
  }, [splitwaveMint, getWalletSolBalance, getWalletTokenBalance, splitwaveSupportedTokens]);
  
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [recipientTokenAccount, setRecipientTokenAccount] = useState<PublicKey>();
  
  const handleRecipientAddressChange = useCallback(async (event) => {
    
    if (splitwaveMint !== undefined){
      try{
        setRecipientAddress(event.target.value);
        // setRecipientAddress(new PublicKey(event.target.value));
        // get the associated token account of the recipient based on the selected token
        if (splitwaveMint !== NATIVE_MINT)
        {
          let recipientTokenAccount =  await getAssociatedTokenAddress(
            new PublicKey(splitwaveMint),
            new PublicKey(event.target.value),
            false,
          );
          setRecipientTokenAccount(recipientTokenAccount);
        }
        else{
          setRecipientTokenAccount(new PublicKey(event.target.value));
        }
        
        if (splitwaveTotalAmount <= 0) {
          throw new Error("Splitwave amount must be greater than 0");
        }
        if (!publicKey) {
          throw new Error("wallet not connected");
        }
        // set the particpants array with the fisrt address as partiapnt address and take the share from the input
        let participant : SplitParticipant; 
        if (newParticipantAddress && newParticipantShare && splitwaveMint) {
          if (splitwaveMint === NATIVE_MINT) {
            participant = {
              paid: false,
              participantSplitAmount: new BN(newParticipantShare * LAMPORTS_PER_SOL),
              participantTokenAccount: new PublicKey(newParticipantAddress),
            };
            let newParticipant: NewParticipant = {
              newParticipantAddress: event.target.value,
              newParticipantShare: 100,
            };
            setNewParticipant([newParticipant]);
            
          } else{
            // get the decimals of the splitwave Mint
            const splitwaveMintDecimals = await getMintDecimals(connection, splitwaveMint);
            // get 10 power splitwaveMintDecimals and store it in a variable
            const splitwaveMintDecimalsPower = Math.pow(10, splitwaveMintDecimals);
            // get the associated token account of the new participant

            participant = {
              paid: false,
              participantSplitAmount: new BN(newParticipantShare * splitwaveMintDecimalsPower),
              participantTokenAccount: await getAssociatedTokenAddress(
                splitwaveMint,
                publicKey,
                false,
              ),
            };
          }
          // setParticipants([...participants, participant]);
    
          setParticipants([participant]);
          setNewParticipantAddress("");
          setNewParticipantShare(0);
          console.log("participants: ", participants);
          
        }
      }
      catch{
       // 
      }
    }

  }, 
  [
    connected, 
    publicKey, 
    wallet, 
    splitwaveMint, 
    splitwaveTotalAmount, 
    newParticipantAddress, 
    newParticipantShare, 
    participants,
    connection,
  ]);
  
  useEffect(() => {
    if (publicKey  && splitwaveMint && splitwaveTotalAmount && connection) {
      const addAuthorityAsParticipant = async () => {
        let participant: SplitParticipant;
        if (publicKey == null)
          throw new Error("Wallet not connected");
        if (splitwaveMint.equals(NATIVE_MINT)) {
          participant = {
            paid: false,
            participantSplitAmount: new BN(splitwaveTotalAmount * LAMPORTS_PER_SOL),
            participantTokenAccount: publicKey,
          };
        } else {
          let mintDecimals = await getMintDecimals(connection, splitwaveMint);
          participant = {
            paid: false,
            participantSplitAmount: new BN(splitwaveTotalAmount * Math.pow(10, mintDecimals)),
            participantTokenAccount: await getAssociatedTokenAddress(
              splitwaveMint,
              publicKey,
              false,
            ),
          };
        }
        setParticipants([participant]);
      };
      addAuthorityAsParticipant();
    }
  }, [publicKey, splitwaveMint, splitwaveTotalAmount, connection]);
  
  const handleNewParticipantChange = useCallback((event) => {
    if (splitwaveMint !== undefined){
        let participantShare = parseFloat(event.target.value);
        if (participantShare < 0) {
          throw new Error("Participant share must be greater than 0");
        }
        if (participantShare > 100) {
          throw new Error("Participant share must be less than 100");
        }
        // subtract the participant share from the share of first participant
        let firstParticipantCurrentAmount = participants[0].participantSplitAmount;
        // setRecipientAddress(new PublicKey(event.target.value));
        // get the associated token account of the recipient based on the selected token
        if (splitwaveMint !== NATIVE_MINT)
        {
          let recipientTokenAccount =  await getAssociatedTokenAddress(
            new PublicKey(splitwaveMint),
            new PublicKey(event.target.value),
            false,
          );
          setRecipientTokenAccount(recipientTokenAccount);
        }
        else{
          setRecipientTokenAccount(new PublicKey(event.target.value));
        }
        console.log("a connected: ", connected);
        console.log("a publicKey: ", publicKey);
        console.log("a wallet: ", wallet);
        console.log("a publicKey: ", publicKey?.toBase58());
        
        if (splitwaveTotalAmount <= 0) {
          throw new Error("Splitwave amount must be greater than 0");
        }
        if (!publicKey) {
          throw new Error("wallet not connected");
        }
        // set the particpants array with the fisrt address as partiapnt address and take the share from the input
        setNewParticipantAddress(publicKey.toBase58());
        setNewParticipantShare(100);
        console.log("newParticipantAddress: ", newParticipantAddress);
        console.log("newParticipantShare: ", newParticipantShare);
        
        let participant : SplitParticipant; 
        if (newParticipantAddress && newParticipantShare && splitwaveMint) {
          if (splitwaveMint === NATIVE_MINT) {
            participant = {
              paid: false,
              participantSplitAmount: new BN(newParticipantShare * LAMPORTS_PER_SOL),
              participantTokenAccount: new PublicKey(newParticipantAddress),
            };
          } else{
            // get the decimals of the splitwave Mint
            const splitwaveMintDecimals = await getMintDecimals(connection, splitwaveMint);
            // get 10 power splitwaveMintDecimals and store it in a variable
            const splitwaveMintDecimalsPower = Math.pow(10, splitwaveMintDecimals);
            // get the associated token account of the new participant

            participant = {
              paid: false,
              participantSplitAmount: new BN(newParticipantShare * splitwaveMintDecimalsPower),
              participantTokenAccount: await getAssociatedTokenAddress(
                splitwaveMint,
                publicKey,
                false,
              ),
            };
          }
          // setParticipants([...participants, participant]);
    
          setParticipants([participant]);
          setNewParticipantAddress("");
          setNewParticipantShare(0);
          console.log("participants: ", participants);
          
        }
      }
      catch{
       // 
      }
    }
  }, []);
  const [participants, setParticipants] = useState<SplitParticipant[]>([]);
  const [showNewParticipant, setShowNewParticipant] = useState(false);
  const [newParticipantValid, setNewParticipantValid] = useState(true);
  
  
  const addParticipant = () => {

    if (!newParticipantAddress || !newParticipantShare) {
      setNewParticipantValid(false);
      return;
    }

    setParticipants(prevParticipants => [
      ...prevParticipants,
      {
        paid: false,
        participantTokenAccount: new PublicKey(newParticipantAddress),
        participantSplitAmount: new BN(newParticipantShare).mul(new BN(LAMPORTS_PER_SOL))
      }
    ]);

    setNewParticipantAddress("");
    setNewParticipantShare(0);
    setShowNewParticipant(false);
    setNewParticipantValid(true);

    // setNewParticipantAddress(newParticipant.participantTokenAccount.toBase58());
    // setNewParticipantShare(newParticipant.participantSplitAmount.toNumber());
  };
  
  const removeParticipant = (index: number) => {
    setParticipants(prevParticipants => {
      return prevParticipants.filter((_, i) => i !== index);
    });
  };

  const showNewParticipantInput = () => {
    setShowNewParticipant(true);
    setNewParticipantAddress("");
    setNewParticipantShare(0);
  };
  
  const findSplitwaveIdPda = useCallback(async () => {
    const [splitwaveIdPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_SPLITWAVE_ID)],
      SPLITWAVE_PROGRAM_ID
    );
    return splitwaveIdPda;
  }, []);

  const checkSplitwaveIdExists = useCallback(async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet 
    ) {
      throw new WalletNotConnectedError();
    }
    const provider = new AnchorProvider(connection, wallet as any, {});
    const splitWaveProgram = new Program<SplitwaveIdlType>(
      splitWaveIdl as any,
      SPLITWAVE_PROGRAM_ID,
      provider,
    );

    const splitwaveIdPda = await findSplitwaveIdPda();
    const splitwaveIdAccount =
      await splitWaveProgram.account.splitwaveId.fetch(splitwaveIdPda);
    if (splitwaveIdAccount.splitwaveId === new BN(0)) {
      setSplitwaveIdExists(false);
      setSplitwaveId(new BN(0));
    }
    else {
      setSplitwaveIdExists(true);
      setSplitwaveId(splitwaveIdAccount.splitwaveId);
    }
  }, [connected, publicKey, wallet, connection, findSplitwaveIdPda]);

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
    const [splitwavePda] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_SPLITWAVE), splitwaveId.toArrayLike(Buffer, "le", 8)],
      SPLITWAVE_PROGRAM_ID
    );
    return splitwavePda;
  };

  const createSplitwaveId = async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet 
    ) {
      throw new WalletNotConnectedError();
    }
    const provider = new AnchorProvider(connection, wallet as any, {});
    const splitWaveProgram = new Program<SplitwaveIdlType>(
      splitWaveIdl as any,
      SPLITWAVE_PROGRAM_ID,
      provider,
      
    );
    // splitWaveProgram.addEventListener()
    const splitwaveIdPda = await findSplitwaveIdPda();

    
    let createSplitwaveIdSim = await splitWaveProgram.methods
    .createSplitwaveId()
    .accountsStrict({
      splitwaveId: splitwaveIdPda,
      systemProgram: anchor.web3.SystemProgram.programId,
      payer: publicKey,
    })
    .signers([])
    .simulate();
    console.log("createSplitwaveIdSim: ", createSplitwaveIdSim.events);
  };

  const createSplitwave = async () => {
    if (
      !connected ||
      !publicKey ||
      !wallet
    ) {
      throw new WalletNotConnectedError();
    }

    const provider = new AnchorProvider(connection, wallet as any, {});

    const splitWaveProgram = new Program<SplitwaveIdlType>(
      splitWaveIdl as any,
      SPLITWAVE_PROGRAM_ID,
      provider
    );

    
    const splitwaveIdPda = await findSplitwaveIdPda();
    const splitwaveIdPdaAccount =
      await splitWaveProgram.account.splitwaveId.fetch(splitwaveIdPda);
    let splitwaveId = splitwaveIdPdaAccount.splitwaveId;
    console.log("splitwaveId: ", splitwaveId.toNumber());

    const splitwavePda = await findSplitwavePda(splitwaveId);
    const [splitwaveTreasuryPda, splitwaveTreasuryBump] = await findSplitwaveTreasuryPda(splitwavePda);
    if (!recipientTokenAccount || !recipientAddress) {
      throw new Error("Recipient token account not found");
    }
    if (splitwaveMint === undefined ) {
      throw new Error("Splitwave mint not found");
    }

    // create pay splitwave instruction with the authorities public key and his share
    let paySplitwaveIx = await splitWaveProgram.methods
      .paySplitwave(participants[0].participantSplitAmount)
      .accountsStrict({
        authority: publicKey,
        recipientTokenAccount: recipientTokenAccount,
        splitwave: splitwavePda,
        splitwaveTreasury: splitwaveTreasuryPda,
        splitwaveMint: splitwaveMint,
        participant: publicKey,
        participantTokenAccount: publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([])
      .instruction();

    let createSplitwaveIx = await splitWaveProgram.methods
      .createSplitwave(
        totalAmountToRecipient,
        participants,
        splitwaveTreasuryBump
      )
      .accountsStrict({
        authority: publicKey,
        recipient: recipientAddress,
        recipientTokenAccount: recipientTokenAccount,
        splitwave: splitwavePda,
        splitwaveTreasury: splitwaveTreasuryPda,
        splitwaveMint: splitwaveMint,
        splitwaveId: splitwaveIdPda,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([])
      .postInstructions([paySplitwaveIx])
      .rpc();
    console.log("createSplitwaveIx: ", createSplitwaveIx);
  };

  useEffect(() => {
    if (connected && publicKey) {
      getWalletSolBalance();
      checkSplitwaveIdExists();
    }
  }, 
  [
    publicKey, 
    wallet, 
    connected, 
    participants, 
    recipientAddress, 
    recipientTokenAccount, 
    splitwaveMint, 
    splitwaveTotalAmount,
    checkSplitwaveIdExists,
    getWalletSolBalance,
  ]);

  
  const renderAddressAndBalance = (label: string, address: PublicKey, solBalance: number, associatedTokenAddress: PublicKey | undefined, associatedTokenAddressBalance: number) => {
    return (
      <div>
        <form className={styles.form}>
          {splitwaveMint !== undefined && splitwaveMint === NATIVE_MINT ?
            <label className={styles.formLabel}>
              {label}: {address.toBase58()} : {solBalance.toFixed(2)} {selectedTokenSymbol}
            </label>
            :
            <label className={styles.formLabel}>
              {label}ATA: {associatedTokenAddress?.toBase58()} : {associatedTokenAddressBalance.toFixed(2)} {selectedTokenSymbol}
            </label>
          }
        </form>
      </div>
    );
  };
  
  const renderParticipants = () => {
    return (
      <form className={styles.form}>
        <label className={styles.formLabel}>Participants</label>
        <>
          {participants.map((participant, index) => {
                return ( 
                <div key={index}>
                  <label className={styles.formLabel}>
                    Participants<Tab/><Tab/>
                    Address<Tab/><Tab/><Tab/>
                    Share %<Tab/><Tab/>
                    Participant Split
                  </label>
                  <br />
                  <label className={styles.formLabel}>
                    Participant{index + 1}    <Tab/> 
                    {participant.participantTokenAccount.toBase58()} 
                    <Tab/> 
                    {participant.participantSplitAmount.toNumber() * 100 /totalAmountToRecipient.toNumber()}%
                    <Tab/><Tab/><Tab/>
                    {participant.participantSplitAmount.toNumber()/(10 ** splitwaveAmountDecimals)}
                  </label>
                  {index > 0 && 
                      <button className={styles.button} onClick={() => removeParticipant(index)}>
                        Remove
                      </button>
                    }
                </div>
              );
          })}
          {showNewParticipant && (
            <div>
              <label className={styles.formLabel}>New Participant</label>
              <Tab/>
              <input
                className={styles.formInput}
                placeholder="Participant Address"
                value={newParticipant[newParticipant].newParticipantAddress}
                onChange={e => setNewParticipantAddress(e.target.value)}
              />
              <Tab/>
              <Tab/>
              <input

                className={styles.formInput}
                placeholder="Participant Share"
                value={newParticipantShare}
                onChange={handleNewParticipantShareChange}
              />
              <Tab/>
              <Tab/>
              <Tab/>
              <button className={styles.button} onClick={() => addParticipant()}>
                Add
              </button>
            </div>
          )}
          {!showNewParticipant && (
            <button className={styles.button} onClick={() => showNewParticipantInput()}>
              Add New Participant
            </button>
          )}
          {!newParticipantValid && (
            <label className={styles.formLabel}>Please enter a valid participant address and share</label>
          )}
        </>
      </form>
    );
  };
  
  
  return (
    <div className={styles.scrollableContainer}>
       {publicKey && connected && (
          <div>
            {renderAddressAndBalance('wallet', publicKey, walletSolBalance, walletAssociatedTokenAddress, walletAssociatedTokenAddressBalance)}
            <br />
            {splitwaveMint !== undefined && renderAddressAndBalance('ZzZ1', ZzZ1, ZzZ1SolBalance, ZzZ1AssociatedTokenAddress, ZzZ1AssociatedTokenAddressBalance)}
            {splitwaveMint !== undefined && renderAddressAndBalance('ZzZ2', ZzZ2, ZzZ2SolBalance, ZzZ2AssociatedTokenAddress, ZzZ2AssociatedTokenAddressBalance)}
            {splitwaveMint !== undefined && renderAddressAndBalance('zzz3', zzz3, zzz3SolBalance, zzz3AssociatedTokenAddress, zzz3AssociatedTokenAddressBalance)}
            {splitwaveMint !== undefined && renderAddressAndBalance('Zzz4', Zzz4, Zzz4SolBalance, Zzz4AssociatedTokenAddress, Zzz4AssociatedTokenAddressBalance)}
            {splitwaveMint !== undefined && renderAddressAndBalance('zzZ5', zzZ5, zzZ5SolBalance, zzZ5AssociatedTokenAddress, zzZ5AssociatedTokenAddressBalance)}
            <br />
            {!splitwaveIdExists && publicKey && (
              <button className={styles.button} onClick={() => createSplitwaveId()}>
                Create Splitwave Id
              </button>
            )}
            {splitwaveIdExists && splitwaveId.toNumber() > 0 && publicKey && (
              <div>
                <form className={styles.form}>
                  <label className={styles.formLabel}>
                    Current Splitwave Id: {splitwaveId.toNumber()}
                  </label>
                </form>
                <br />
                <br />
                <form className={styles.form}>
                  <label className={styles.formLabel}>
                    Select Mint:
                  </label>
                  <select 
                    className={styles.select} 
                    value={selectedTokenSymbol} 
                    onChange={handleSelectSplitwaveSupportedToken}>
                      {splitwaveSupportedTokens.map((item, index) => (
                        <option key={index} value={item.symbol}>{item.symbol}</option>
                      ))}
                  </select>   
                </form>
                  {
                    splitwaveMint !== undefined && 
                    (
                      (
                        splitwaveMint !== NATIVE_MINT && 
                        walletAssociatedTokenAddressBalance > 0
                      ) ||
                      (
                        splitwaveMint === NATIVE_MINT && 
                        walletSolBalance > 0
                      )
                    ) &&
                    (
                      <form className={styles.form}>
                        <label className={styles.formLabel}>
                          Amount: {splitwaveTotalAmount}
                        </label>
                        <input
                          id="amount"
                          className={styles.formInput}
                          placeholder="Amount"
                          type="number"
                          min={0.01}
                          max={splitwaveMint !== NATIVE_MINT  ? walletAssociatedTokenAddressBalance : walletSolBalance}
                          onChange={handleTotalAmountChange}
                          step="0.01"
                        />
                      </form>
                    )
                  }
                  {
                    splitwaveMint !== undefined &&
                    splitwaveTotalAmount > 0.01  && 
                    ( 
                      (splitwaveMint === NATIVE_MINT && walletSolBalance > 0 && splitwaveTotalAmount < walletSolBalance) ||
                      (splitwaveMint !== NATIVE_MINT && walletAssociatedTokenAddressBalance > 0 && splitwaveTotalAmount < walletAssociatedTokenAddressBalance)) && 
                    (
                      <form className={styles.form}>
                        <label className={styles.formLabel}>
                          Recipient Address: {recipientAddress} 
                        </label>
                        <input
                          id="recipientAddress"
                          required
                          className={styles.formInput}
                          placeholder="Recipient Address"
                          onChange={handleRecipientAddressChange}
                          value={recipientAddress}
                        />
                      </form>
                  )}
                  <br/>
                  <br/>
                  { recipientAddress &&   
                    splitwaveMint !== undefined &&
                    splitwaveTotalAmount > 0.01  && 
                    ( 
                      (splitwaveMint === NATIVE_MINT && walletSolBalance > 0 && splitwaveTotalAmount < walletSolBalance) ||
                      (splitwaveMint !== NATIVE_MINT && walletAssociatedTokenAddressBalance > 0 && splitwaveTotalAmount < walletAssociatedTokenAddressBalance)
                    ) && 
                    renderParticipants()
                  }
                  <button
                    className={styles.button}
                    onClick={() => createSplitwave()}
                    type="submit"
                  >
                    Create Splitwave
                  </button>
              </div>
            )}
          </div>
      )}
    </div>
  );
};

export default CreateSplitwave;