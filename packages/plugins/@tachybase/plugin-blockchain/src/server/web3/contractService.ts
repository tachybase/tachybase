import fs from 'fs';
import path from 'path';

import { web3Provider } from './web3Provider';

class ContractService {
  private contract: any;
  private defaultAccount: string;
  private currentContractAbi: any;
  private currentContractAddress: string;

  constructor() {
    this.initializeContract();
    setInterval(this.checkForContractAddressOrAbiChange.bind(this), 60000); // 每分钟检查一次
  }

  /**
   * 初始化合约实例
   */
  private initializeContract() {
    const web3 = web3Provider.web3;
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY as string);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    this.currentContractAbi = this.getContractAbi();
    this.currentContractAddress = this.getContractAddress();
    this.updateContractInstance(this.currentContractAbi, this.currentContractAddress);
    this.defaultAccount = account.address;
  }

  /**
   * 获取合约文件中ABI
   */
  private getContractAbi(): any {
    const contractJson = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../../artifacts/contracts/DataStorage.sol/DataStorage.json'),
        'utf-8',
      ),
    );
    return contractJson.abi;
  }

  /**
   * 获取合约文件中地址
   */
  private getContractAddress(): string {
    const contractAddresses = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../../contract-addresses.json'), 'utf-8'),
    );
    return contractAddresses.DataStorage;
  }

  /**
   * 检查合约地址或ABI是否发生变化
   */
  private checkForContractAddressOrAbiChange() {
    console.log('正在检查合约地址或 ABI 是否发生变化...');
    const contractABI = this.getContractAbi();
    const contractAddress = this.getContractAddress();

    if (
      contractAddress !== this.currentContractAddress ||
      JSON.stringify(contractABI) !== JSON.stringify(this.currentContractAbi)
    ) {
      console.log(`检测到合约地址或 ABI 发生变化。更新合约实例为新地址: ${contractAddress}`);
      this.updateContractInstance(contractABI, contractAddress);
    } else {
      console.log('未检测到合约地址或 ABI 发生变化。');
    }
  }

  /**
   * 更新合约实例
   * @param {any} newAbi 新的合约 ABI
   * @param {string} newAddress 新的合约地址
   */
  private updateContractInstance(newAbi: any, newAddress: string) {
    this.currentContractAbi = newAbi;
    this.currentContractAddress = newAddress;
    this.contract = new web3Provider.web3.eth.Contract(newAbi, newAddress);
  }

  /**
   * 存储数据到卡片链
   * @param {string} id 数据的唯一标识符
   * @param {string} hashedData 加密后的数据
   * @param {string} salt 数据使用的盐
   */
  async storeData(id: string, hashedData: string, salt: string): Promise<void> {
    this.checkForContractAddressOrAbiChange();
    await this.contract.methods.storeData(id, hashedData, salt).send({ from: this.defaultAccount });
  }

  /**
   * 从卡片链获取数据
   * @param {string} id 数据的唯一标识符
   * @returns {Promise<{ hashedData: string; salt: string }>} 返回哈希数据和盐
   */
  async getData(id: string): Promise<{ hashedData: string; salt: string }> {
    this.checkForContractAddressOrAbiChange();
    return this.contract.methods.getData(id).call();
  }

  // 监听合约事件
  setupEventListeners() {
    this.checkForContractAddressOrAbiChange();
    // 监听 DataStored 事件
    const dataStoredSubscription = this.contract.events.DataStored({ fromBlock: 'latest' });

    dataStoredSubscription.on('data', (event) => {
      console.log('交易hash:' + event.transactionHash);
      console.log('卡片高度:' + event.blockNumber);
      console.log('DataStored event:', event.returnValues);
    });
    dataStoredSubscription.on('error', (error) => {
      console.error('Error on DataStored event:', error);
    });

    // 监听 DataDeleted 事件
    const dataDeletedSubscription = this.contract.events.DataDeleted({ fromBlock: 'latest' });

    dataDeletedSubscription.on('data', (event) => {
      console.log('交易hash:' + event.transactionHash);
      console.log('卡片高度:' + event.blockNumber);
      console.log('DataDeleted event:', event.returnValues);
    });
    dataDeletedSubscription.on('error', (error) => {
      console.error('Error on DataDeleted event:', error);
    });
  }
}

export const contractService = new ContractService();
