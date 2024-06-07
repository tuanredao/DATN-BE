// users/users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { OfferSchema } from './offer.model'; 


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Offer', schema: OfferSchema }])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
