const apiUrl = 'https://api-amoy.polygonscan.com/api';
const apiKey = 'YourApiKeyToken';

async function fetchLogs() {
  const url = `${apiUrl}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x47EFC7e582cA15E802E23BC077eBdf252953Ac4f&topic0=0x35fa1df47dae385ce2a501434f277f7ffffea1da9b2e68182a201378c815af6e&apikey=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === '1') {
      data.result.forEach((log) => {
        const formattedLog = formatLog(log);
        console.log('Formatted Log:', formattedLog);
      });
    } else {
      console.error('Error fetching logs:', data.message);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function hexToInt(hex) {
  return parseInt(hex, 16);
}

function parseHexData(data) {
  const strippedData = data.slice(2);
  const partLength = strippedData.length / 4;
  const parts = [];

  for (let i = 0; i < 4; i++) {
    parts.push(strippedData.slice(i * partLength, (i + 1) * partLength));
  }

  return parts.map((part) => hexToInt(`0x${part}`));
}

function formatLog(log) {
  const parsedData = parseHexData(log.data);
  return {
    id: hexToInt(log.topics[1]),
    nftContract: log.topics[2].replace(/^0x0+/, '0x'),
    tokenId: hexToInt(log.topics[3]),
    price: (parsedData[0] / 1e18).toString(),
    stepPrice: (parsedData[1] / 1e18).toString(),
    startTime: parsedData[2].toString(),
    endTime: parsedData[3].toString(),
  };
}

fetchLogs();
