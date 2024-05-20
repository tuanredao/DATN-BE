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
    '0x47f515ED707abfB69Eab27224A9CB996528dA761';

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
      const uri = await contract.tokenURI(tokenId);
      const response = await fetch(uri);
  
      if (!response.ok) {
        throw new Error('Failed to fetch token info');
      }
  
      const json = await response.json();
      const image = json.image;
      console.log(image);
      
  
      const nftInfo = { tokenInfo, image };
  
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

    for (const tokenId of tokenIds)  {
      const tokenPromise = contract.getTokenInfo(tokenId);
      tokenPromises.push(tokenPromise);
    }

    const tokenInfos = await Promise.all(tokenPromises);

    const formattedTokenInfos = await Promise.all(tokenInfos.map(async (tokenInfo, index) => {
      const tokenId = index.toString();
      const uri = await contract.tokenURI(tokenId);
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error(`Failed to fetch token info for tokenId ${tokenId}`);
      }

      const json = await response.json();
      const image = json.image;

      return {
        bienSo: tokenInfo[0],
        tinhThanhPho: tokenInfo[1],
        loaiXe: tokenInfo[2],
        trangThai: tokenInfo[3],
        image: image,
      };
    }));

    return formattedTokenInfos;
  } catch (error) {
    console.error('Error fetching token infos:', error);
    return [];
  }
}

  
}
