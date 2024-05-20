// moralisInitializer.ts

import Moralis from 'moralis';
import * as dotenv from 'dotenv';
dotenv.config();

let isMoralisInitialized: boolean = false;

export async function initializeMoralis() {
  if (!isMoralisInitialized) {
    await Moralis.start({
      apiKey: process.env.MORALLIS_KEY,
    });

    isMoralisInitialized = true;
  }
}
