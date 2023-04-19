import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/374f43e9cd494c50b395773721764cf3",
      accounts: ["a4a59222428d7ebc5bd8d47a6305d262977b1751a34d09ec23eb061a78c295d9"],
    }
  }
};

export default config;
