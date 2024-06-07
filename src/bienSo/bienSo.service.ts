import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BienSo } from './bienSo.model';
import { getNFTService } from 'src/getNFT/getNFT.service';

@Injectable()
export class BienSoService {
  constructor(
    @InjectModel('BienSo') private readonly bienSoModel: Model<BienSo>,
    private readonly nftService: getNFTService,
  ) {}

  async saveNFTs(): Promise<void> {
    const allNFTs = await this.nftService.getAll();
    for (const nft of allNFTs) {
      const existingBienSo = await this.bienSoModel.findOne({ tokenId: nft.tokenId });

      if (existingBienSo) {
        await this.bienSoModel.updateOne({ tokenId: nft.tokenId }, nft);
      } else {
        const newBienSo = new this.bienSoModel(nft);
        await newBienSo.save();
      }
    }
    console.log("save ok");
    
  }

  async getNFTs(): Promise<BienSo[]> {
    try {
      const allNFTs = await this.bienSoModel.find().exec();
      return allNFTs;
    } catch (error) {
      throw new Error(`Không thể lấy dữ liệu NFT từ cơ sở dữ liệu: ${error}`);
    }
  }

  async getNFTsCount(): Promise<number> {
    try {
      const allNFTs = await this.bienSoModel.find().exec();
      return allNFTs.length;
    } catch (error) {
      throw new Error(`Không thể lấy số lượng biển số chưa được sử dụng từ cơ sở dữ liệu: ${error}`);
    }
  }
}
