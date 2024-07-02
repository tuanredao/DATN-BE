import { Controller, Post, Body, Get, Query, Put, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add')
  async createUser(@Body() userData: Partial<User>) {
    const createdUser = await this.usersService.createUser(userData);
    return { message: 'User created successfully', user: createdUser };
  }

  @Get('getUser')
  async findUserDataByWallet(@Query('wallet') wallet: string) {
    const userData = await this.usersService.findUserDataByWallet(wallet);
    if (userData) {
      return { message: 'User data found', userData };
    } else {
      return { message: 'User data not found' };
    }
  }

  @Put('edit')
  async editUserDataByWallet(@Query('wallet') wallet: string, @Body() updatedData: Partial<User>) {
    const editedUser = await this.usersService.editUserDataByWallet(wallet, updatedData);
    if (editedUser) {
      return { message: 'User data edited successfully', user: editedUser };
    } else {
      return { message: 'Failed to edit user data' };
    }
  }

  @Get('all')
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return { message: 'All users retrieved successfully', users };
  }

  @Patch('updateKYC')
  async updateKYCStatus(@Query('wallet') wallet: string) {
    const updatedUser = await this.usersService.updateKYCStatus(wallet);
    if (updatedUser) {
      return { message: 'KYC status updated successfully', user: updatedUser };
    } else {
      return { message: 'Failed to update KYC status' };
    }
  }

  @Get('checkKyc')
  async checkKYCStatus(@Query('wallet') wallet: string) {
    const kycStatus = await this.usersService.checkKYCStatus(wallet);
    return kycStatus;
  }
}
