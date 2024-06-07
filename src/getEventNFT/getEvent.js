const fs = require('fs');
const { Web3 } = require('web3');

// Khai báo provider Ethereum, ví dụ như Infura
const web3 = new Web3("wss://polygon-bor-amoy-rpc.publicnode.com");

// Địa chỉ của contract
const contractAddress = '0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f';
const path = require('path');
const abiPath = path.join(__dirname, 'nftAbi.json');
// Đọc ABI từ file
const abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

const contract = new web3.eth.Contract(abi, contractAddress);

contract.getPastEvents('DepositMade', {
  filter: {  },
  fromBlock: 0, 
  toBlock: 'latest' 
}).then((events) => {
  console.log(events);
}).catch((error) => {
  console.error(error);
});
