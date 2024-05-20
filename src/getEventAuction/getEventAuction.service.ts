import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { getListingService } from 'src/getListing/getListing.service'; // Sửa lại import

const apiUrl: string = 'https://api-amoy.polygonscan.com/api';
const apiKey: string = 'YourApiKeyToken';
const topic: string = '0x35fa1df47dae385ce2a501434f277f7ffffea1da9b2e68182a201378c815af6e';
const address: string = '0x1F31C80B765E00fCdDf2F58153Cd75E423fbE680';

@Injectable()
export class getEventAuctionService {
    constructor(
        private readonly getListingService: getListingService, // Sửa tên service
    ) {}

    async getAllListings(): Promise<any[]> {
        try {
            const ids = await this.getListings();
            const listingInfo = await this.getAll(ids);
            return listingInfo;
        } catch (error) {
            throw new Error('Error getting listings and info: ' + error);
        }
    }

    async getListings(): Promise<number[]> {
        const url: string = `${apiUrl}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${address}&topic0=${topic}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === '1') {
                const ids = data.result.map((log: any) => this.hexToInt(log.topics[1]));
                return ids;
            } else {
                throw new Error('Error fetching logs: ' + data.message);
            }
        } catch (error) {
            throw new Error('Fetch error: ' + error);
        }
    }

    hexToInt(hex: string): number {
        return parseInt(hex, 16);
    }

    async getAll(ids: number[]): Promise<any[]> {
        const listingPromises = ids.map(async (id) => {
            const listingInfo = await this.getListingService.getListingInfo(id.toString());
            return {id, listingInfo};
        });

        return Promise.all(listingPromises);
    }
}
