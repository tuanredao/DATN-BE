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

  async getTokenInfo(tokenId: string): Promise<any> {
    const contract = await this.getContractInstance(
      this.contractAddress,
      this.nftAbi,
    );
  
    try {
      const tokenInfo = await contract.getTokenInfo(tokenId);
      const owner = await contract.ownerOf(tokenId)
      const uri = await contract.tokenURI(tokenId);
      const response = await fetch(uri);
  
      if (!response.ok) {
        throw new Error('Failed to fetch token info');
      }
  
      const json = await response.json();
      const image = json.image;
      console.log(image);
      
  
      const nftInfo = { tokenInfo, owner, image };
      console.log(nftInfo);
      
  
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
        tokenId: tokenId,
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
