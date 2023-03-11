import { PublicKey } from "@solana/web3.js";

export const SEED_SPLITWAVE = "splitwave";

export interface PartSplit {
  split: Number;
  paid: Boolean;
  participant: PublicKey;
}

export const testwallet1: PublicKey = new PublicKey(
  "DHywTRDpPWiyxXfgdaaPPXeBsvU6Lmofkk8SAU7kZzZ1"
);
export const testwallet2: PublicKey = new PublicKey(
  "BfnRc8FyxxTcdGEfsokkuLPR2RiE6xbL8nM56EQ7ZzZ2"
);
export const testwalletl3: PublicKey = new PublicKey(
  "5gBmQCEfMUQCPogBdKDR5kW6UaMnE5CPRDDdoWQgZZZ3"
);
export const testwalletm3: PublicKey = new PublicKey(
  "2get7zBCcjqLLsgHCYTTFABQUGzXfksq7RNHQZgWzzz3"
);
export const testwallet4: PublicKey = new PublicKey(
  "GHaeX7RnfxZEtRcYrUBNFzNeJPjK3kXKi9jyGQfpZzz4"
);
