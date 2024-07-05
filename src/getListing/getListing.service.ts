import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import Moralis from 'moralis';
import * as dotenv from 'dotenv';
dotenv.config();
import { initializeMoralis } from 'src/config/moralisInitializer';
import { getNFTService } from 'src/getNFT/getNFT.service';

@Injectable()
export class getListingService {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly auctionAbi: string;
  private readonly contractAddress =
    '0xd4f90022234114eE921AA5E3e86f2b27682AA188';

  private async initializeMoralis() {
    await initializeMoralis(); // Sử dụng hàm từ file mới
  }
  constructor(private readonly nftService: getNFTService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      'https://rpc-amoy.polygon.technology',
    );
    this.auctionAbi = './config/auctionAbi.json';
    this.nftService = nftService;
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
  async getListingInfo(listingId: string): Promise<any> {
    const contract = await this.getContractInstance(
      this.contractAddress,
      this.auctionAbi,
    );

    try {
      const listing = await contract.listings(listingId);


      const listingInfo = {
        nftContract: listing[0],
        tokenId: parseInt(listing[1]),
        price: parseInt(listing[2])/1e18,
        stepPrice: parseInt(listing[3])/1e18,
        highestOfferId: parseInt(listing[4]),
        highestPrice: parseInt(listing[5]),
        startTime: parseInt(listing[6]),
        endTime: parseInt(listing[7]),
        listingStatus: parseInt(listing[8]),
      };

      const nftInfo = await this.nftService.getTokenInfo(listingInfo.tokenId.toString())
      console.log(listingInfo);
      

      return {listingInfo, nftInfo};
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async getListingData(listingId: string): Promise<any> {
    const contract = await this.getContractInstance(
      this.contractAddress,
      this.auctionAbi,
    );

    try {
      const listing = await contract.listings(listingId);


      const listingData = {
        highestOfferId: parseInt(listing[4]),
        highestPrice: parseInt(listing[5])/1e18,
      };
      

      return listingData;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  
  async getDeadline(): Promise<any> {
    const contract = await this.getContractInstance(
      this.contractAddress,
      this.auctionAbi,
    );

    try {
      const deadline = await contract.deadline();

      return deadline.toNumber();
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }
}
