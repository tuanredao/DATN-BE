import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import Moralis from 'moralis';
import * as dotenv from 'dotenv';
dotenv.config();
import { initializeMoralis } from 'src/config/moralisInitializer';

@Injectable()
export class getMyNFTService {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly nftAbi: string;
  private readonly contractAddress =
    '0xF39480AaD2848047D6354B5199Ef078c30B0cE49';

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

  async getWalletNFTs(address: string): Promise<string[]> {
    try {
      await this.initializeMoralis();
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: '0x13882',
        format: 'decimal',
        tokenAddresses: [this.contractAddress],
        mediaItems: false,
        address: address,
      });
      console.log(response.result);

      const tokenIds = response.result.map((item: any) => item.tokenId);
      return tokenIds;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTokenInfo(tokenId: string): Promise<any> {
    const contract = await this.getContractInstance(
      this.contractAddress,
      this.nftAbi,
    );

    try {
      const tokenInfo = await contract.getTokenInfo(tokenId);
 
      const nftInfo = { tokenInfo };

      return nftInfo;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async getAll(address: string): Promise<any[]> {
    try {
      const tokenIds = await this.getWalletNFTs(address);
      const contract = await this.getContractInstance(
        this.contractAddress,
        this.nftAbi,
      );

      const tokenPromises = [];

      for (const tokenId of tokenIds) {
        const tokenPromise = contract.getTokenInfo(tokenId);
        tokenPromises.push(tokenPromise);
      }

      const tokenInfos = await Promise.all(tokenPromises);

      const formattedTokenInfos = await Promise.all(
        tokenInfos.map(async (tokenInfo, index) => {
          const tokenId = index.toString();

          return {
            tokenId: tokenId,
            bienSo: tokenInfo[1],
            tinhThanhPho: tokenInfo[2],
            loaiXe: tokenInfo[3],
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
