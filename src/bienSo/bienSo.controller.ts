import { Controller, Post, Body, Get, Query, Put } from '@nestjs/common';
import { BienSoService } from './bienSo.service';
import { BienSo } from './bienSo.model';

@Controller('BienSo')
export class BienSoController {
  constructor(private readonly BienSoService: BienSoService) {}
  @Post('save-all')
  async saveAllNFTs(): Promise<void> {
    const res =await this.BienSoService.saveNFTs();
    console.log("Res", res);
    
    return res
  }

  @Get('all')
  async getAllNFTs(): Promise<BienSo[]> {
    return await this.BienSoService.getNFTs();
  }
}
