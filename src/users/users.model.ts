import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: Number,
  email: String,
  city: String, // Tỉnh/Thành Phố
  district: String, // Quận/Huyện
  ward: String, // Phường/Xã
  dateOfBirth: Date, // Ngày sinh
  placeOfBirth: String, // Nơi sinh
  frontImage: String, // Ảnh mặt trước
  backImage: String, // Ảnh mặt sau
  wallet: { type: String, unique: true, immutable: true }, // Ví liên kết
});

export interface User extends mongoose.Document {
  fullName: String;
  phoneNumber: Number;
  email: String;
  city: String;
  district: String;
  ward: String;
  dateOfBirth: Date;
  placeOfBirth: String;
  frontImage: String;
  backImage: String;
  wallet: String;
}
