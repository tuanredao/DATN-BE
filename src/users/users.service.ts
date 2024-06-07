import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  async findUserDataByWallet(wallet: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ wallet }).exec();
    } catch (error) {
      console.error("Error finding user data by wallet", error);
      return null;
    }
  }

  async editUserDataByWallet(wallet: string, updatedData: Partial<User>): Promise<User | null> {
    const { wallet: walletToRemove, ...dataToUpdate } = updatedData;
    try {
      return await this.userModel.findOneAndUpdate({ wallet }, dataToUpdate, { new: true }).exec();
    } catch (error) {
      console.error("Error editing user data by wallet", error);
      return null;
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error("Error finding all users", error);
      return [];
    }
  }

  async updateKYCStatus(wallet: string): Promise<User | null> {
    try {
      return await this.userModel.findOneAndUpdate(
        { wallet, KYC: false },
        { KYC: true },
        { new: true }
      ).exec();
    } catch (error) {
      console.error("Error updating KYC status", error);
      return null;
    }
  }
  
}
