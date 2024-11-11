import { Web3 } from 'web3';

export class Web3Provider {
  public web3: Web3;

  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.web3.currentProvider.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.web3.currentProvider.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.web3.currentProvider.on('end', () => {
      console.log('WebSocket connection closed. Reconnecting...');
      this.connectWebSocket();
    });
  }

  private connectWebSocket() {
    this.web3.setProvider(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));

    this.web3.currentProvider.on('connect', () => {
      console.log('WebSocket reconnected');
    });

    this.web3.currentProvider.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.web3.currentProvider.on('end', () => {
      console.log('WebSocket connection closed again. Reconnecting...');
      this.connectWebSocket();
    });
  }
}

export const web3Provider = new Web3Provider();
