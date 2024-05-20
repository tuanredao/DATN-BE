// nft.module.ts

import { Module } from '@nestjs/common';
import { mintNFTService } from './mintNFT.service';
import { mintNFTController } from './mintNFT.controller';

@Module({
  providers: [mintNFTService],
  controllers: [mintNFTController],
})
export class mintNFTModule {}
