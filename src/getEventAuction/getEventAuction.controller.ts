import { Controller, Get, Query } from '@nestjs/common';
import { getEventAuctionService } from './getEventAuction.service';

@Controller('auction')
export class getEventAuctionController {
  constructor(
    private readonly getEventAuctionService: getEventAuctionService,
  ) {}

  @Get('listing')
  async getListing(): Promise<any[]> {
    try {
      const listings = await this.getEventAuctionService.getAllListings();
      console.log('Listings:', listings);
      return listings;
    } catch (error) {
      throw error;
    }
  }

  @Get('makeoffer')
  async getMakeOffer(): Promise<any[]> {
    try {
      const offers = await this.getEventAuctionService.getMakeOffer();
      console.log('Listings:', offers);
      return offers;
    } catch (error) {
      throw error;
    }
  }
}
