import { UseStruct } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, Struct } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TokenOwnerOffCurveError,
} from "@solana/spl-token";

export const SEED_SPLITWAVE = "splitwave";
export const SEED_SPLITWAVE_TREASURY = "splitwave-treasury";
export const SEED_SPLITWAVE_ID = "splitwave-id";

export type PendingSplitwaves = {
  splitwaveId: BN,
  splitwaveAmount: BN,
}

export type MintAddressSymbols = {
  symbol: string;
  mintAddress: PublicKey;
};

export type SplitParticipant = {
  paid: boolean;
  participantSplitAmount: BN;
  participantTokenAccount: PublicKey;
}

export type NewParticipant = {
  newParticipantAddress: string;
  newParticipantShare: number;
}
export const getAssociatedTokenBump = async (
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) => {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer()))
    throw new TokenOwnerOffCurveError();

  const [address, bump] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId
  );

  return bump;
};

export const SPLITWAVE_PROGRAM_ID = new PublicKey(
  "pp1aQnBZ8271r5LcZymbudhTXbExDQiH2CzDj3N6ujY"
);

export const ZzZ1PK = "DHywTRDpPWiyxXfgdaaPPXeBsvU6Lmofkk8SAU7kZzZ1";
export const ZzZ2PK = "BfnRc8FyxxTcdGEfsokkuLPR2RiE6xbL8nM56EQ7ZzZ2";
export const zzz3PK = "2get7zBCcjqLLsgHCYTTFABQUGzXfksq7RNHQZgWzzz3";
export const Zzz4PK = "GHaeX7RnfxZEtRcYrUBNFzNeJPjK3kXKi9jyGQfpZzz4";
export const zzZ5PK = "4QLiMNTLG1r4S1C8eQdzWrUBm1qHgtikTZYJyc56zzZ5";

export const ZzZ1 = new PublicKey(ZzZ1PK);
export const ZzZ2 = new PublicKey(ZzZ2PK);
export const zzz3 = new PublicKey(zzz3PK);
export const Zzz4 = new PublicKey(Zzz4PK);
export const zzZ5 = new PublicKey(zzZ5PK);
