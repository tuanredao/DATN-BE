// nft.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { getMyNFTService } from './getMyNFT.service';

@Controller('mynft')
export class getMyNFTController {
  constructor(private readonly nftService: getMyNFTService) {}

  @Get('owning')
  async getTokenInfo(@Query('address') address: string): Promise<any> {
    return this.nftService.getWalletNFTs(address);
  }

  @Get('all')
  async getAll(@Query('address') address: string): Promise<any> {
    return this.nftService.getAll(address);
  }
}
