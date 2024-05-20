// nft.module.ts

import { Module } from '@nestjs/common';
import { getMyNFTService } from './getMyNFT.service';
import { getMyNFTController } from './getMyNFT.controller';

@Module({
  providers: [getMyNFTService],
  controllers: [getMyNFTController],
})
export class getMyNFTModule {}
