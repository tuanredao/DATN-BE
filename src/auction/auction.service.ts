import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './auction.model';
import { getEventAuctionService } from 'src/getEventAuction/getEventAuction.service';
import { BienSoService } from 'src/bienSo/bienSo.service';

interface AuctionData {
  id: number;
  listingInfo: {
    listingInfo: {
      nftContract: string;
      tokenId: number;
      price: number;
      stepPrice: number;
      highestOfferId: number;
      highestPrice: number;
      startTime: number;
      endTime: number;
      listingStatus: number;
    };
    nftInfo: {
      tokenInfo: string[];
      owner: string;
      image: string;
    };
  };
}

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel('Auction') private readonly auctionModel: Model<Auction>,
    private readonly auctionService: getEventAuctionService,
    private readonly BienSoService: BienSoService,
  ) {}

  async saveListing() {
    const allAuction = await this.auctionService.getAllListings();

    for (const auction of allAuction) {
      const auctionData: AuctionData = auction;
      const listingInfo = auctionData.listingInfo.listingInfo;
      const nftInfo = auctionData.listingInfo.nftInfo;

      const newAuction = {
        id: auctionData.id,
        tokenId: listingInfo.tokenId,
        nftContract: listingInfo.nftContract,
        price: listingInfo.price,
        stepPrice: listingInfo.stepPrice,
        highestOfferId: listingInfo.highestOfferId,
        highestPrice: listingInfo.highestPrice,
        startTime: listingInfo.startTime,
        endTime: listingInfo.endTime,
        listingStatus: listingInfo.listingStatus,
        tokenInfo: nftInfo.tokenInfo,
        bienSo: nftInfo.tokenInfo[1],
        city: nftInfo.tokenInfo[2],
        type: nftInfo.tokenInfo[3],
        nftStatus: nftInfo.tokenInfo[4],
        owner: nftInfo.owner,
      };
      

      const existingAuction = await this.auctionModel.findOne({
        id: auctionData.id,
      });

      if (existingAuction) {
        await this.auctionModel.updateOne(
          { id: existingAuction.id },
          newAuction,
        );
      } else {
        await this.auctionModel.create(newAuction);
      }
    }
  }

  async getListing(): Promise<Auction[]> {
    try {
      const allNFTs = await this.auctionModel.find().exec();
      return allNFTs;
    } catch (error) {
      throw new Error(`Không thể lấy dữ liệu NFT từ cơ sở dữ liệu: ${error}`);
    }
  }

  async getListingById(id: number): Promise<Auction | null> {
    try {
      const auction = await this.auctionModel.findOne({ id }).exec();
      if (!auction) {
        throw new Error(`Listing với id ${id} không tồn tại`);
      }
      return auction;
    } catch (error) {
      throw new Error(`Không thể tìm listing với id ${id}: ${error.message}`);
    }
  }

  async calculateAuctionStats(): Promise<{ totalNFT: number; totalSold: number; soldNFT:number; pendingNFT: number; notSoldNFT: number }> {
    let totalSold = 0;
    let pendingNFT = 0;
    let soldNFT = 0;
    let notSoldNFT = 0;
    let totalNFT = 0;
  
    try {
      const auctions = await this.auctionModel.find().exec();
      for (const auction of auctions) {
        if (auction.listingStatus === 3) {
          totalSold += Number(auction.highestPrice);
          soldNFT++;
        } else if (auction.listingStatus === 0 || auction.listingStatus === 1) {
          pendingNFT++;
        }
      }
      totalNFT = await this.BienSoService.getNFTsCount();
      notSoldNFT = totalNFT - pendingNFT - soldNFT
      return { totalNFT, totalSold, soldNFT, pendingNFT, notSoldNFT };
    } catch (error) {
      throw new Error(`Không thể tính toán thống kê phiên đấu giá: ${error.message}`);
    }
  }  
}
