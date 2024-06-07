import { Schema, Document } from 'mongoose';

export const BienSoSchema = new Schema({
  tokenId: { type: Number, required: true, unique: true },
  bienSo: { type: String, required: true },
  tinhThanhPho: { type: String, required: true },
  loaiXe: { type: String, required: true },
  trangThai: { type: String, required: true },
});

export interface BienSo extends Document {
  tokenId: Number;
  bienSo: string;
  tinhThanhPho: string;
  loaiXe: string;
  trangThai: string;
}
