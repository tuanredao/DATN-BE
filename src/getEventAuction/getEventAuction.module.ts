// nft.module.ts

import { Module } from '@nestjs/common';
import { getEventAuctionService } from './getEventAuction.service';
import { getEventAuctionController } from './getEventAuction.controller';
import { getListingService } from 'src/getListing/getListing.service';
import { getNFTService } from 'src/getNFT/getNFT.service';

@Module({
  providers: [getEventAuctionService, getListingService, getNFTService],
  controllers: [getEventAuctionController],
})
export class getEventAuctionModule {}
