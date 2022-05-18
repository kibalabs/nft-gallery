import { dateFromString } from '@kibalabs/core';

export class TokenTransfer {
  readonly tokenTransferId: number;
  readonly transactionHash: string;
  readonly registryAddress: string;
  readonly fromAddress: string;
  readonly toAddress: string;
  readonly tokenId: string;
  readonly value: number;
  readonly gasLimit: number;
  readonly gasPrice: number;
  readonly gasUsed: number;
  readonly blockNumber: number;
  readonly blockHash: string;
  readonly blockDate: Date;

  public constructor(tokenTransferId: number, transactionHash: string, registryAddress: string, fromAddress: string, toAddress: string, tokenId: string, value: number, gasLimit: number, gasPrice: number, gasUsed: number, blockNumber: number, blockHash: string, blockDate: Date) {
    this.tokenTransferId = tokenTransferId;
    this.transactionHash = transactionHash;
    this.registryAddress = registryAddress;
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.tokenId = tokenId;
    this.value = value;
    this.gasLimit = gasLimit;
    this.gasPrice = gasPrice;
    this.gasUsed = gasUsed;
    this.blockNumber = blockNumber;
    this.blockHash = blockHash;
    this.blockDate = blockDate;
  }

  public static fromObject = (obj: Record<string, unknown>): TokenTransfer => {
    return new TokenTransfer(
      Number(obj.tokenTransferId),
      String(obj.transactionHash),
      String(obj.registryAddress),
      String(obj.fromAddress),
      String(obj.toAddress),
      String(obj.tokenId),
      Number(obj.value),
      Number(obj.gasLimit),
      Number(obj.gasPrice),
      Number(obj.gasUsed),
      Number(obj.blockNumber),
      String(obj.blockHash),
      dateFromString(obj.blockDate as string),
    );
  };
}
