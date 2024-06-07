// users/users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { AuctionSchema } from './auction.model'; 
import { BienSoService } from 'src/bienSo/bienSo.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Auction', schema: AuctionSchema }])],
  controllers: [AuctionController],
  providers: [AuctionService, BienSoService],
})
export class AuctionModule {}
