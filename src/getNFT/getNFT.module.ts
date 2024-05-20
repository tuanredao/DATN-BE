// nft.module.ts

import { Module } from '@nestjs/common';
import { getNFTService } from './getNFT.service';
import { getNFTController } from './getNFT.controller';

@Module({
  providers: [getNFTService],
  controllers: [getNFTController],
})
export class getNFTModule {}
