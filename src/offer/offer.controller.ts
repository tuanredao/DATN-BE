import { Controller, Post, Body, Get, Query, Put, Param, NotFoundException } from '@nestjs/common';
import { OfferService } from './offer.service';
import { Offer } from './offer.model';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get('save')
  async saveAllNFTs(): Promise<string> {
    await this.offerService.saveOffer();
    return 'All offers have been saved to the database';
  }

  @Get('all')
  async getAllOffers(): Promise<Offer[]> {
    return await this.offerService.getOffer();
  }

  @Get('info')
  async getOfferInfo(
    @Query('id') id?: number,
    @Query('offerId') offerId?: number,
  ): Promise<Offer> {
    const offer = await this.offerService.getOfferinfo(id, offerId);
    if (!offer) {
      throw new NotFoundException(`Offer with id ${id || offerId} not found`);
    }
    return offer;
  }

  @Get('find')
  async getOffer(
    @Query('id') id?: number,
    @Query('offerId') offerId?: number,
  ): Promise<Offer> {
    const offer = await this.offerService.getOfferById(id, offerId);
    if (!offer) {
      throw new NotFoundException(`Offer with id ${id || offerId} not found`);
    }
    return offer;
  }

  @Get('findid')
  async getOfferById(
    @Query('id') id?: number,
  ): Promise<any> {
    const offer = await this.offerService.getOffersByItemId(id);
    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }
    return offer;
  }

  @Get('findbidder')
  async getOfferByBidder(
    @Query('bidder') bidder?: string,
  ): Promise<any> {
    const offer = await this.offerService.getOffersByBidder(bidder);
    if (!offer) {
      throw new NotFoundException(`Offer with bidder ${bidder} not found`);
    }
    return offer;
  }
}
