// nft.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { mintNFTService } from './mintNFT.service';

@Controller('mint')
export class mintNFTController {
  constructor(private readonly nftService: mintNFTService) {}

  // @Get('nft')
  // async getTokenInfo(@Query('tokenId') tokenId: string): Promise<any> {
    
  //   return this.nftService.(tokenId);
  // }

}
