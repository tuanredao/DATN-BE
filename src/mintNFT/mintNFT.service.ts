import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import Moralis from 'moralis';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class mintNFTService {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly nftAbi: string;
  private readonly contractAddress =
    '0xF39480AaD2848047D6354B5199Ef078c30B0cE49';
  private isMoralisInitialized: boolean = false;

  private async initializeMoralis() {
    if (!this.isMoralisInitialized) {
      await Moralis.start({
        apiKey: process.env.MORALLIS_KEY,
      });

      this.isMoralisInitialized = true;
    }
  }

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      'https://rpc-amoy.polygon.technology',
    );
    this.nftAbi = './config/nftAbi.json';
  }

  private readAbiFile(filePath: string): string {
    return fs.readFileSync(filePath).toString();
  }

  private async getContractInstance(
    address: string,
    abi: string,
  ): Promise<any> {
    const contractAbi = this.readAbiFile(abi);
    return new ethers.Contract(address, contractAbi, this.provider);
  }

  async getSupply(): Promise<any | null> {
    try {
      await this.initializeMoralis();

      const response = await Moralis.EvmApi.nft.getNFTCollectionStats({
        chain: '0x13882',
        address: this.contractAddress,
      });
      const jsonResponse = response['jsonResponse'];
      const supply = jsonResponse.total_tokens;

      return supply;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  
}
