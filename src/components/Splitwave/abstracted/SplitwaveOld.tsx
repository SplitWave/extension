import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

import * as anchor from "@project-serum/anchor";

import { AnchorProvider, BN, Program } from "@project-serum/anchor";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import * as splitWaveIdl from "../../../idl/splitwave.json";
import { Splitwave as SplitwaveIdlType } from "../splitwave";
import {
  SEED_SPLITWAVE,
  SEED_SPLITWAVE_ID,
  SplitParticipant,
  SPLITWAVE_PROGRAM_ID,
  ZzZ2,
  zzz3,
  Zzz4,
  zzZ5,
  SEED_SPLITWAVE_TREASURY,
} from "../splitwaveConfig";

const SplitwaveOld = () => {
  const { connected, connect, publicKey } = useWallet();
  const wallet = useWallet();

  const connection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl("devnet")
  );
  // const connection = new anchor.web3.Connection("https://localhost:8899");

  const [participantSplitAmount, setParticipantSplitAmount] =
    useState<number>(0);
  const [solAmount, setSolAmount] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [participants, setParticipants] = useState<SplitParticipant[]>([]);

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [newParticipantAddress, setNewParticipantAddress] =
    useState<string>("");
  const [newParticipantShare, setNewParticipantShare] = useState<number>(0);

  const handleTotalAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTotalAmount(Number(event.target.value));
  };

  const handleNewParticipantAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewParticipantAddress(event.target.value);
  };

  const handleNewParticipantShareChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewParticipantShare(Number(event.target.value));
  };

  const addParticipant = () => {
    if (newParticipantAddress && newParticipantShare) {
      const participant: SplitParticipant = {
        paid: false,
        participantSplitAmount: new BN(newParticipantShare * LAMPORTS_PER_SOL),
        participantTokenAccount: new PublicKey(newParticipantAddress),
      };
      setParticipants([...participants, participant]);
      setNewParticipantAddress("");
      setNewParticipantShare(0);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParticipantSplitAmount(Number(event.target.value));
  };
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
    const provider = new AnchorProvider(connection, wallet as any, {});
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

    const provider = new AnchorProvider(connection, wallet as any, {});

    const splitWaveProgram = new Program<SplitwaveIdlType>(
      splitWaveIdl as any,
      SPLITWAVE_PROGRAM_ID,
      provider
    );

    let participants: SplitParticipant[] = [
      {
        paid: false,
        participantSplitAmount: new BN(0.5 * LAMPORTS_PER_SOL),
        participantTokenAccount: ZzZ2,
      },
      {
        paid: false,
        participantSplitAmount: new BN(0.3 * LAMPORTS_PER_SOL),
        participantTokenAccount: zzz3,
      },
      {
        paid: false,
        participantSplitAmount: new BN(0.2 * LAMPORTS_PER_SOL),
        participantTokenAccount: Zzz4,
      },
    ];

    const splitwaveIdPda = await findSplitwaveIdPda();

    const splitwaveIdPdaAccount =
      await splitWaveProgram.account.splitwaveId.fetch(splitwaveIdPda);
    let splitwaveId = splitwaveIdPdaAccount.splitwaveId;
    console.log("splitwaveId: ", splitwaveId.toNumber());

    const splitwavePda = await findSplitwavePda(splitwaveId);
    const [splitwaveTreasuryPda, splitwaveTreasuryBump] =
      await findSplitwaveTreasuryPda(splitwavePda);
    // create pay splitwave instruction with the authorities public key and his share
    let paySplitwaveIx = await splitWaveProgram.methods
      .paySplitwave(new BN(participantSplitAmount * LAMPORTS_PER_SOL))
      .accountsStrict({
        authority: wallet.publicKey,
        recipientTokenAccount: zzZ5,
        splitwave: splitwavePda,
        splitwaveTreasury: splitwaveTreasuryPda,
        splitwaveMint: NATIVE_MINT,
        participant: wallet.publicKey,
        participantTokenAccount: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([])
      .instruction();

    let createSplitwaveIx = await splitWaveProgram.methods
      .createSplitwave(
        new BN(1 * LAMPORTS_PER_SOL),
        participants,
        splitwaveTreasuryBump
      )
      .accountsStrict({
        authority: wallet.publicKey,
        recipient: zzZ5,
        recipientTokenAccount: zzZ5,
        splitwave: splitwavePda,
        splitwaveTreasury: splitwaveTreasuryPda,
        splitwaveMint: NATIVE_MINT,
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
    console.log(
      "splitwaveIdPdaAccount.splitwaveId: ",
      splitwaveIdPdaAccount.splitwaveId
    );
    let id = new BN(2);
    const splitwavePda = await findSplitwavePda(id);

    //fetch the splitwave account
    let splitwave = await splitWaveProgram.account.splitwave.fetch(
      splitwavePda
    );
    console.log("splitwave: ", splitwave);
    console.log(
      "splitwave.authority.toBase58(): ",
      splitwave.authority.toBase58()
    );

    // paySplitwaveTx.push(createParticipantTokenAccountIx);
    console.log("authority: ", splitwave.authority.toBase58());
    console.log("mint: ", NATIVE_MINT.toBase58());
    console.log(
      "recipientTokenAccount: ",
      splitwave.recipientTokenAccount.toBase58()
    );
    console.log("splitwave: ", splitwavePda.toBase58());
    console.log("splitwaveTreasury: ", splitwave.splitwaveTreasury.toBase58());
    console.log("splitwaveMint: ", splitwave.splitwaveMint.toBase58());
    console.log("splitwaveId: ", splitwave.splitwaveId);
    // console.log("splitwaveTokenAccount: ", splitwaveTokenAccount.toBase58());
    console.log("participant: ", wallet.publicKey.toBase58());
    // console.log(
    //   "participantTokenAccount: ",
    //   participantTokenAccount.toBase58()
    // );
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
      .paySplitwave(new BN(participantSplitAmount * LAMPORTS_PER_SOL))
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

  useEffect(() => {
    // Call the getWalletBalance function on component mount to fetch the wallet balance
    getWalletSolBalance();
  }, [publicKey, connected]);
  return (
    <Container maxWidth="sm" style={{ backgroundColor: "white" }}>
      {!wallet && !publicKey && !connected && (
        <Button variant="contained" color="primary" onClick={() => connect()}>
          Connect Wallet
        </Button>
      )}
      {publicKey && connected && (
        <>
          <Typography variant="h4" component="h2" gutterBottom>
            Wallet Address
          </Typography>
          <Typography variant="body1" gutterBottom>
            {walletAddress}
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Wallet Balance
          </Typography>
          <Typography variant="body1" gutterBottom>
            {solAmount.toFixed(2)} SOL
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => createSplitwaveId()}
              >
                Create Splitwave Id
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => createSplitwave()}
              >
                Create Splitwave
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                value={participantSplitAmount}
                onChange={handleAmountChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => paySplitwave()}
              >
                Pay Splitwave
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      {publicKey && connected && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Total Amount"
                type="number"
                value={totalAmount}
                onChange={handleTotalAmountChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Participant Address"
                value={newParticipantAddress}
                onChange={handleNewParticipantAddressChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Participant Share"
                type="number"
                value={newParticipantShare}
                onChange={handleNewParticipantShareChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={addParticipant}
              >
                Add Participant
              </Button>
            </Grid>
            {/* ... (all the other components) */}
          </Grid>
        </>
      )}
      {participants.length > 0 && (
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            Participants
          </Typography>
          {participants.map((participant, index) => (
            <Box key={index} mb={2}>
              <Paper elevation={3} style={{ padding: "16px" }}>
                <Typography variant="body1" gutterBottom>
                  Address: {participant.participantTokenAccount.toBase58()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Share:{" "}
                  {participant.participantSplitAmount.toNumber() /
                    LAMPORTS_PER_SOL}{" "}
                  SOL
                </Typography>
              </Paper>
            </Box>
          ))}
        </>
      )}
    </Container>
  );
};

export default SplitwaveOld;
