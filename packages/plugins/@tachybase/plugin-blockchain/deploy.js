// scripts/deploy.js
const hre = require('hardhat');
const fs = require('fs');

// npx hardhat compile
// npx hardhat run scripts/deploy.js
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  //部署DataStorage合约
  const DataStorage = await hre.ethers.getContractFactory('DataStorage');
  const dataStorage = await DataStorage.deploy();
  console.log('DataStorage deployed to:', dataStorage.target);

  // 将DataStorage合约地址保存到一个JSON文件中
  const contractAddresses = {
    DataStorage: dataStorage.target,
  };

  fs.writeFileSync('contract-addresses.json', JSON.stringify(contractAddresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
