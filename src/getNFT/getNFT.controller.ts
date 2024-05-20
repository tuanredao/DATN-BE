// nft.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { getNFTService } from './getNFT.service';

@Controller('nft')
export class getNFTController {
  constructor(private readonly nftService: getNFTService) {}

  @Get('tokenId')
  async getTokenInfo(@Query('tokenId') tokenId: string): Promise<any> {
    
    return this.nftService.getTokenInfo(tokenId);
  }

  @Get('bienso')
  async getAll(): Promise<any> {
    
    return this.nftService.getAll();
  }
}
