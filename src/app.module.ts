import { Module } from '@nestjs/common';
import { mintNFTModule } from './mintNFT/mintNFT.module';
import { getNFTModule } from './getNFT/getNFT.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMyNFTModule } from './getMyNFT/getMyNFT.module';
import { getListingModule } from './getListing/getListing.module';
import { getEventAuctionModule } from './getEventAuction/getEventAuction.module';
import { BienSoSchema } from './bienSo/bienSo.model';
import { BienSoService } from './bienSo/bienSo.service';
import { getNFTService } from './getNFT/getNFT.service';
import { BienSoController } from './bienSo/bienSo.controller';
import { AuctionSchema } from './auction/auction.model';
import { AuctionService } from './auction/auction.service';
import { getEventAuctionService } from './getEventAuction/getEventAuction.service';
import { AuctionController } from './auction/auction.controller';
import { getListingService } from './getListing/getListing.service';
import { OfferModule } from './offer/offer.module';
import { OfferService } from './offer/offer.service';
import { OfferController } from './offer/offer.controller';
import { OfferSchema } from './offer/offer.model';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://johnny:Anon1404@cluster0.fqslaae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    getNFTModule,
    getEventAuctionModule,
    UsersModule,
    getMyNFTModule,
    getListingModule,
    MongooseModule.forFeature([{ name: 'BienSo', schema: BienSoSchema }]),
    MongooseModule.forFeature([{ name: 'Auction', schema: AuctionSchema }]),
    MongooseModule.forFeature([{ name: 'Offer', schema: OfferSchema }]),
  ],
  providers: [BienSoService, AuctionService, getNFTService, getEventAuctionService, getListingService, OfferService],
  controllers: [BienSoController, AuctionController, OfferController],
})
export class AppModule {}
