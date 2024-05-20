// nft.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { getListingService } from './getListing.service';

@Controller('auction')
export class getListingController {
  constructor(private readonly nftService: getListingService) {}

  @Get('id')
  async getTokenInfo(@Query('id') id: string): Promise<any> {
    return this.nftService.getListingInfo(id);
  }

}
