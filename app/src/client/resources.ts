import { dateFromString } from '@kibalabs/core';
import { BigNumber } from 'ethers';

export class TokenTransfer {
  public constructor(
    readonly tokenTransferId: number,
    readonly transactionHash: string,
    readonly registryAddress: string,
    readonly fromAddress: string,
    readonly toAddress: string,
    readonly tokenId: string,
    readonly value: BigNumber,
    readonly gasLimit: number,
    readonly gasPrice: number,
    readonly gasUsed: number,
    readonly blockNumber: number,
    readonly blockHash: string,
    readonly blockDate: Date,
  ) {}

  public static fromObject = (obj: Record<string, unknown>): TokenTransfer => {
    return new TokenTransfer(
      Number(obj.tokenTransferId),
      String(obj.transactionHash),
      String(obj.registryAddress),
      String(obj.fromAddress),
      String(obj.toAddress),
      String(obj.tokenId),
      BigNumber.from(String(obj.value)),
      Number(obj.gasLimit),
      Number(obj.gasPrice),
      Number(obj.gasUsed),
      Number(obj.blockNumber),
      String(obj.blockHash),
      dateFromString(obj.blockDate as string),
    );
  };
}

export class TokenAttribute {
  public constructor(
    readonly traitType: string,
    readonly value: string,
  ) {}

  public static fromObject = (obj: Record<string, unknown>): TokenAttribute => {
    return new TokenAttribute(
      String(obj.trait_type),
      String(obj.value),
    );
  };
}

export class CollectionToken {
  public constructor(
    readonly registryAddress: string,
    readonly tokenId: string,
    readonly name: string,
    readonly imageUrl: string | null,
    readonly description: string | null,
    readonly attributes: TokenAttribute[],
  ) {}

  public static fromObject = (obj: Record<string, unknown>): CollectionToken => {
    return new CollectionToken(
      String(obj.registryAddress),
      String(obj.tokenId),
      String(obj.name),
      obj.imageUrl ? String(obj.imageUrl) : null,
      obj.description ? String(obj.description) : null,
      (obj.attributes as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => TokenAttribute.fromObject(innerObj)),
    );
  };
}

export class Airdrop {
  public constructor(
    readonly token: CollectionToken,
    readonly name: string,
    readonly isClaimed: boolean,
    readonly claimToken: CollectionToken,
    readonly claimUrl: string,
  ) {}

  public static fromObject = (obj: Record<string, unknown>): Airdrop => {
    return new Airdrop(
      CollectionToken.fromObject(obj.token as Record<string, unknown>),
      String(obj.name),
      Boolean(obj.isClaimed),
      CollectionToken.fromObject(obj.claimToken as Record<string, unknown>),
      String(obj.claimUrl),
    );
  };
}
