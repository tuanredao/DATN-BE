// users/users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { AuctionSchema } from './auction.model'; 


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Auction', schema: AuctionSchema }])],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
