import { PublicKey } from "@solana/web3.js";
import * as anchor from "projectSerumAnchor0260";

export const SEED_SPLITWAVE = "splitwave";

export interface PartSplit {
  split: Number;
  paid: Boolean;
  participant: anchor.web3.PublicKey;
}
export const SPLITWAVE_ADDRESS = new anchor.web3.PublicKey(
  "BswawfVwXfa928UXU4ZB4NGfoDrGondZ4JVAGscpGMTB"
);

export const testwallet1: anchor.web3.PublicKey = new anchor.web3.PublicKey(
  "DHywTRDpPWiyxXfgdaaPPXeBsvU6Lmofkk8SAU7kZzZ1"
);
export const testwallet2: anchor.web3.PublicKey = new anchor.web3.PublicKey(
  "BfnRc8FyxxTcdGEfsokkuLPR2RiE6xbL8nM56EQ7ZzZ2"
);
export const testwalletl3: anchor.web3.PublicKey = new anchor.web3.PublicKey(
  "5gBmQCEfMUQCPogBdKDR5kW6UaMnE5CPRDDdoWQgZZZ3"
);
export const testwalletm3: anchor.web3.PublicKey = new anchor.web3.PublicKey(
  "2get7zBCcjqLLsgHCYTTFABQUGzXfksq7RNHQZgWzzz3"
);
export const testwallet4: anchor.web3.PublicKey = new anchor.web3.PublicKey(
  "GHaeX7RnfxZEtRcYrUBNFzNeJPjK3kXKi9jyGQfpZzz4"
);
