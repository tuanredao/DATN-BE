import { Controller, Post, Body, Get, Query, Put, Param, NotFoundException } from '@nestjs/common';
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
}
