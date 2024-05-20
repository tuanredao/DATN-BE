import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './auction.model';
import { getEventAuctionService } from 'src/getEventAuction/getEventAuction.service';

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
        bienSo: nftInfo.tokenInfo[0],
        city: nftInfo.tokenInfo[1],
        type: nftInfo.tokenInfo[2],
        nftStatus: nftInfo.tokenInfo[3],
        owner: nftInfo.owner,
        image: nftInfo.image,
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
}
