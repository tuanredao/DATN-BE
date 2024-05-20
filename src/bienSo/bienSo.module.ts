// users/users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BienSoController } from './bienSo.controller';
import { BienSoService } from './bienSo.service';
import { BienSoSchema } from './bienSo.model'; 


@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: BienSoSchema }])],
  controllers: [BienSoController],
  providers: [BienSoService],
})
export class BienSoModule {}
