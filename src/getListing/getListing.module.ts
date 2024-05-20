// nft.module.ts

import { Module } from '@nestjs/common';
import { getListingService } from './getListing.service';
import { getListingController } from './getListing.controller';
import { getNFTService } from 'src/getNFT/getNFT.service';

@Module({
  providers: [getListingService, getNFTService],
  controllers: [getListingController],
})
export class getListingModule {}
