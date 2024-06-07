import * as mongoose from 'mongoose';

export const OfferSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  offerId: { type: Number, required: true, unique: true },
  bidder: String,
  price: Number,
  timestamp: Number,
  tx: String,
});

export interface Offer extends mongoose.Document {
  id: Number;
  offerId: Number;
  bidder: String;
  price: Number;
  timestamp: Number;
  tx: String;
}
