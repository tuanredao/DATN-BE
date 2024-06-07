import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import Moralis from 'moralis';
import * as dotenv from 'dotenv';
dotenv.config();
import { initializeMoralis } from 'src/config/moralisInitializer';

@Injectable()
export class getNFTService {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly nftAbi: string;
  private readonly contractAddress =
    '0xbf35ff6953b0ec6F29DcB9982Ce71f7C7D0fF356';

  private async initializeMoralis() {
    await initializeMoralis(); // Sử dụng hàm từ file mới
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

      console.log(supply);

      return supply;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getTokenInfo(tokenId: string): Promise<any> {
    const contract = await this.getContractInstance(
      this.contractAddress,
      this.nftAbi,
    );

    try {
      const tokenInfo = await contract.getTokenInfo(tokenId);
      const owner = await contract.ownerOf(tokenId);

      const nftInfo = { tokenInfo, owner };

      return nftInfo;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async getAll(): Promise<any[]> {
    await this.initializeMoralis();
    try {
      const supply = await this.getSupply();
      const contract = await this.getContractInstance(
        this.contractAddress,
        this.nftAbi,
      );

      const tokenPromises = [];

      for (let i = 0; i < supply; i++) {
        const tokenId = i.toString();
        const tokenPromise = contract.getTokenInfo(tokenId);
        tokenPromises.push(tokenPromise);
      }

      const tokenInfos = await Promise.all(tokenPromises);

      const formattedTokenInfos = await Promise.all(
        tokenInfos.map(async (tokenInfo, index) => {
          const tokenId = index.toString();
          console.log(tokenInfo);

          return {
            tokenId: tokenId,
            bienSo: tokenInfo[1],
            loaiXe: tokenInfo[3],
            tinhThanhPho: tokenInfo[2],
            trangThai: tokenInfo[4],
          };
        }),
      );

      return formattedTokenInfos;
    } catch (error) {
      console.error('Error fetching token infos:', error);
      return [];
    }
  }
}
