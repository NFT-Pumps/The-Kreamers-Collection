require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');

let SCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const PROJECT_ID = process.env.PROJECT_ID
const PK = process.env.PK

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
let DestinationNetwork = process.env.SOURCE_CHAIN; //"testnet";
let networks = {};
let token = "ETH";
switch (DestinationNetwork.toLowerCase()) {
  case "fork":
    DestinationNetwork = "hardhat"
    networks = {
      hardhat: {
        forking: {
          url: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.alchemy,
          blockNumber: 14390000,
          accounts: [`0x${PK}`]
        }
      }
    };
    break;
  case "hardat":
    networks;
    break;
  case "rinkeby":
    networks = {
      hardhat: { chainId: 1337 },
      rinkeby: {
        url: `https://rinkeby.infura.io/v3/${PROJECT_ID}`,
        accounts: [`0x${PK}`]
      }
    };
    break;
  case "mainnet":
    networks = {
      hardhat: { chainId: 1 },
      mainnet: {
        url: `https://mainnet.infura.io/v3/${PROJECT_ID}`,
        accounts: [`0x${PK}`],
      }
    }
    break;
  case "testnet":
    token = "BNB"
    networks = {
      hardhat: { chainId: 97 },
      testnet: {
        url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
        accounts: [`0x${PK}`],
        gasPrice: 20000000000
      }
    }
    break;
  case "bsc":
    DestinationNetwork = "mainnet"
    token = "BNB"
    networks = {
      hardhat: { chainId: 56 },
      mainnet: {
        url: `https://bsc-dataseed.binance.org/`,
        accounts: [`0x${PK}`],
        gasPrice: 20000000000,
        gas: 5000000
      }
    }
    break;
  case "cronos":
    DestinationNetwork = "mainnet"
    token = "CRO"
    networks = {
      hardhat: { chainId: 25 },
      mainnet: {
        url: `https://evm-cronos.crypto.org/`,
        accounts: [`0x${PK}`],
      }
    }
    break;
  case "cronos testnet":
    DestinationNetwork = "testnet"
    token = "CRO"
    networks = {
      hardhat: { chainId: 338 },
      testnet: {
        url: `https://cronos-testnet-3.crypto.org:8545/`,
        accounts: [`0x${PK}`],
      }
    }
    break;
}

switch (token) {
  case "BNB":
    SCAN_API_KEY = process.env.BSCSCAN_API_KEY
    break;
  case "CRO":
    SCAN_API_KEY = process.env.CROSCAN_API_KEY
    break;
  default:
    SCAN_API_KEY = process.env.ETHERSCAN_API_KEY
    break;
}


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    }
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: 'USD',
    token: 'ETH',
    coinmarketcap: process.env.CMCAPI, //'00a4f49a-2c1b-4315-8209-0599ae260257',
    gasPriceApi:	'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    gasPrice: 77
  },
  moch: {
    reporter: 'eth-gas-reporter',
    //reporterOptions : {  } // See options below
  },
  defaultNetwork: DestinationNetwork,
  networks: networks,
  etherscan: {
    apiKey: SCAN_API_KEY,
  }

  // defaultNetwork: "mainnet",
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY,
  // },
  // networks: {
  //   hardhat: { chainId: 1 },
  //   mainnet: {
  //     url: `https://mainnet.infura.io/v3/${PROJECT_ID}`,
  //     accounts: [`0x${PK}`],
  //   }
  // }
};
