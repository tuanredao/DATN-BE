import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { getListingService } from 'src/getListing/getListing.service'; // Sửa lại import

const Web3 = require('web3')
const apiUrl: string = 'https://api-amoy.polygonscan.com/api';
const apiKey: string = 'YourApiKeyToken';
const topicCreate: string = '0x35fa1df47dae385ce2a501434f277f7ffffea1da9b2e68182a201378c815af6e';
const topicMakeOffer: string = '0xd7df0c72641d362ea57ecc9cab99c77f936e36bb826f096258c3404196b26d6a';
const address: string = '0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f';

@Injectable()
export class getEventAuctionService {
    constructor(
        private readonly getListingService: getListingService,
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
        const url: string = `${apiUrl}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${address}&topic0=${topicCreate}&apikey=${apiKey}`;
        console.log(url);
        
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

    
    async  getMakeOffer(): Promise<any[]> {
        const url: string = `${apiUrl}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${address}&topic0=${topicMakeOffer}&apikey=${apiKey}`;
    
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.status === '1') {
                return data.result.map((log: any) => {
                    const id = this.hexToInt(log.topics[1]);
                    const bidder = Web3.eth.abi.decodeParameter("address", log.topics[2]);
    
                    const data = log.data.slice(2); 
                    const priceHex = data.slice(0, 64);
                    const offerIdHex = data.slice(64, 128);
                    const price = this.hexToInt(priceHex)/1e18;
                    const offerId = this.hexToInt(offerIdHex);
                    const timestamp = this.hexToInt(log.timeStamp);
                    const tx = log.transactionHash;
    
                    return {
                        id,
                        bidder,
                        price,
                        offerId,
                        timestamp,
                        tx
                    };
                });
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

    hexToEthereumAddress(hex) {
        hex = hex.slice(2);
        hex = hex.toLowerCase();
        return '0x' + hex;
    }

    async getAll(ids: number[]): Promise<any[]> {
        const listingPromises = ids.map(async (id) => {
            const listingInfo = await this.getListingService.getListingInfo(id.toString());
            return {id, listingInfo};
        });

        return Promise.all(listingPromises);
    }
}
