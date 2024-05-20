import { Controller, Post, Body, Get, Query, Put } from '@nestjs/common';
import { BienSoService } from './bienSo.service';
import { BienSo } from './bienSo.model';

@Controller('BienSo')
export class BienSoController {
  constructor(private readonly BienSoService: BienSoService) {}
  @Get('save-all')
  async saveAllNFTs(): Promise<string> {
    await this.BienSoService.saveNFTs();
    return 'All NFTs have been saved to the database';
  }

  @Get('all')
  async getAllNFTs(): Promise<BienSo[]> {
    return await this.BienSoService.getNFTs();
  }
}
