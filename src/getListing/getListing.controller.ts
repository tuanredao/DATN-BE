// nft.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { getListingService } from './getListing.service';

@Controller('auction')
export class getListingController {
  constructor(private readonly listingService: getListingService) {}

  @Get('id')
  async getTokenInfo(@Query('id') id: string): Promise<any> {
    return this.listingService.getListingInfo(id);
  }

  @Get('data')
  async getAuctionData(@Query('id') id: string): Promise<any> {
    return this.listingService.getListingData(id);
  }

  @Get('deadline')
  async getAuctionDeadline(): Promise<any> {
    let deadline = this.listingService.getDeadline();
    return deadline;
  }

}
