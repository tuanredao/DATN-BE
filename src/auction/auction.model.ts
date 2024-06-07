import * as mongoose from 'mongoose';

export const AuctionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nftContract: String,
  tokenId: Number,
  price: Number,
  stepPrice: Number,
  highestOfferId: Number,
  highestPrice: Number,
  startTime: Number,
  endTime: Number,
  listingStatus: Number,
  bienSo: String,
  city: String,
  type: String,
  nftStatus: Number,
  owner: String,
});

export interface Auction extends mongoose.Document {
  id: Number;
  nftContract: String;
  tokenId: Number;
  price: Number;
  stepPrice: Number;
  highestOfferId: Number;
  highestPrice: Number;
  startTime: Number;
  endTime: Number;
  listingStatus: Number;
  bienSo: String;
  city: String;
  type: String;
  nftStatus: Number;
  owner: String;
}
