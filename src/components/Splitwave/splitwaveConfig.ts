import { PublicKey } from "@solana/web3.js";

export const SEED_SPLITWAVE = "splitwave";
export const SEED_SPLITWAVE_ID = "splitwave-id";

export interface PartSplit {
  split: Number;
  paid: Boolean;
  participant: PublicKey;
}

export const SPLITWAVE_PROGRAM_ID = new PublicKey(
  "SpWwab5CWBLYHfXfnfRqobDq7122etY6V35ed6ZTw9J"
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
