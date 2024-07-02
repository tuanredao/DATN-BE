import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer } from './offer.model';
import { getEventAuctionService } from 'src/getEventAuction/getEventAuction.service';
import Moralis from 'moralis';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
import { initializeMoralis } from 'src/config/moralisInitializer';
import { ethers } from 'ethers';

interface OfferData {
  id: number;
  bidder: string;
  price: number;
  offerId: number;
  timestamp: number;
  tx: string;
}

@Injectable()
export class OfferService {
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly auctionAbi: string;
  private readonly contractAddress =
    '0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f';


  constructor(@InjectModel('Offer') private readonly OfferModel: Model<Offer>,
  private readonly AuctionService: getEventAuctionService,) {
    this.provider = new ethers.providers.JsonRpcProvider(
      'https://rpc-amoy.polygon.technology',
    );
    this.auctionAbi = './config/auctionAbi.json';
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

  async getOfferinfo(listingId: number, offerId: number): Promise<any> {
    const contract = await this.getContractInstance(
      this.contractAddress,
      this.auctionAbi,
    );

    try {
      const offer = await contract.offers(listingId, offerId);


      const offerInfo = {
        paidAmount: offer[4]/1e18,
        offerStatus: parseInt(offer[5]),
      };
      return offerInfo;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async saveOffer() {
    const allOffers = await this.AuctionService.getMakeOffer();

    for (const offer of allOffers) {
      const offerData: OfferData = offer;

      const newOffer = {
        id: offerData.id,
        offerId: offerData.offerId,
        bidder: offerData.bidder,
        price: offerData.price,
        timestamp: offerData.timestamp,
        tx: offerData.tx,
      };

      try {
        const existingOffer = await this.OfferModel.findOne({
          id: offerData.id,
          offerId: offerData.offerId,
        }).exec();

        if (!existingOffer) {
          await this.OfferModel.create(newOffer);
        } else {
          await this.OfferModel.updateOne(
            { id: existingOffer.id, offerId: existingOffer.offerId },
            newOffer,
          );
        }
      } catch (error) {
        throw new Error(`Could not save offer: ${error.message}`);
      }
    }
  }

  async getOffer(): Promise<Offer[]> {
    try {
      const allOffers = await this.OfferModel.find().exec();
      return allOffers;
    } catch (error) {
      throw new Error(`Không thể lấy dữ liệu offer từ cơ sở dữ liệu: ${error}`);
    }
  }

  async getOfferById(id: number, offerId: number): Promise<Offer | null> {
    try {
      const offer = await this.OfferModel.findOne({ id, offerId }).exec();
      if (!offer) {
        throw new Error(
          `offer với id ${id} và offerId ${offerId} không tồn tại`,
        );
      }
      return offer;
    } catch (error) {
      throw new Error(
        `Không thể tìm offer với id ${id} và offerId ${offerId}: ${error.message}`,
      );
    }
  }

  async getOffersByItemId(id: number): Promise<Offer[]> {
    try {
      const offers = await this.OfferModel.find({ id }).exec();
      if (!offers || offers.length === 0) {
        throw new Error(`Không có ưu đãi nào với id ${id}`);
      }
      return offers;
    } catch (error) {
      throw new Error(`Không thể lấy ưu đãi với id ${id}: ${error.message}`);
    }
  }

  async getOffersByBidder(bidder: string): Promise<Offer[]> {
    try {
      const offers = await this.OfferModel.find({ bidder }).exec();
      if (!offers || offers.length === 0) {
        throw new Error(`Không có ưu đãi nào với bidder ${bidder}`);
      }
      return offers;
    } catch (error) {
      throw new Error(`Không thể lấy ưu đãi với bidder ${bidder}: ${error.message}`);
    }
  }

  async getHighestBidderById(id: number): Promise<any> {
    try {
      const offers = await this.OfferModel.find({ id }).exec();

      if (!offers || offers.length === 0) {
        throw new Error(`Không có ưu đãi nào với id ${id}`);
      }

      let highestOffer = offers.reduce((prev, current) => {
        return prev.offerId > current.offerId ? prev : current;
      });

      return highestOffer.bidder;
    } catch (error) {
      throw new Error(`Không thể lấy bidder với id ${id}: ${error.message}`);
    }
  }
  
}
