import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { Auction } from './auction.model';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get('save')
  async saveAllNFTs(): Promise<string> {
    await this.auctionService.saveListing();
    return 'All Auctions have been saved to the database';
  }

  @Get('all')
  async getAllNFTs(): Promise<Auction[]> {
    return await this.auctionService.getListing();
  }

  @Get('find/:id')
  async getListingById(@Param('id') id: number): Promise<Auction> {
    const auction = await this.auctionService.getListingById(id);
    if (!auction) {
      throw new NotFoundException(`Auction with id ${id} not found`);
    }
    return auction;
  }

  @Get('stats')
  async getAuctionStats(): Promise<{
    totalNFT: number;
    totalSold: number;
    soldNFT: number;
    pendingNFT: number;
    notSoldNFT: number;
  }> {
    const stats = await this.auctionService.calculateAuctionStats();
    return stats;
  }

  @Get('status')
  async getPaidAuctions(): Promise<{ paid: Auction[], unsuccess: Auction[] }>{
    const [paidAuctions, unsuccessAuctions] = await Promise.all([
      this.auctionService.getPaidAuctions(),
      this.auctionService.getUnsuccessdAuctions(),
    ]);

    return {
      paid: paidAuctions,
      unsuccess: unsuccessAuctions,
    };
  }

  @Get('unsuccess')
  async getUnsuccessdAuctions(): Promise<Auction[]> {
    const paidAuctions = await this.auctionService.getUnsuccessdAuctions();
    return paidAuctions;
  }
}
