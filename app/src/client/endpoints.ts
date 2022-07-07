import { RequestData, ResponseData } from '@kibalabs/core';

import * as Resources from './resources';

export class GetTokenRecentTransfersRequest extends RequestData {
}

export class GetTokenRecentTransfersResponse extends ResponseData {
  readonly tokenTransfers: Resources.TokenTransfer[];

  public constructor(TokenRecentSales: Resources.TokenTransfer[]) {
    super();
    this.tokenTransfers = TokenRecentSales;
  }

  public static fromObject = (obj: Record<string, unknown>): GetTokenRecentTransfersResponse => {
    return new GetTokenRecentTransfersResponse(
      (obj.tokenTransfers as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.TokenTransfer.fromObject(innerObj)),
    );
  };
}

export class GetCollectionHoldingsRequest extends RequestData {
}

export class GetCollectionHoldingsResponse extends ResponseData {
  readonly tokens: Resources.CollectionToken[];

  public constructor(collectionHoldings: Resources.CollectionToken[]) {
    super();
    this.tokens = collectionHoldings;
  }

  public static fromObject = (obj: Record<string, unknown>): GetCollectionHoldingsResponse => {
    return new GetCollectionHoldingsResponse(
      (obj.tokens as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.CollectionToken.fromObject(innerObj)),
    );
  };
}

export class SubmitTreasureHuntForCollectionTokenRequest extends RequestData {
  readonly userAddress: string;
  readonly signature: string;

  public constructor(userAddress: string, signature: string) {
    super();
    this.userAddress = userAddress;
    this.signature = signature;
  }

  public toObject = (): Record<string, unknown> => {
    return {
      userAddress: this.userAddress,
      signature: this.signature,
    };
  };
}

export class SubmitTreasureHuntForCollectionTokenResponse extends ResponseData {
  // eslint-disable-next-line unused-imports/no-unused-vars
  public static fromObject = (obj: Record<string, unknown>): SubmitTreasureHuntForCollectionTokenResponse => {
    return new SubmitTreasureHuntForCollectionTokenResponse();
  };
}

export class ListCollectionTokenAirdropsRequest extends RequestData {
}

export class ListCollectionTokenAirdropsResponse extends ResponseData {
  readonly airdrops: Resources.Airdrop[];

  public constructor(TokenRecentSales: Resources.Airdrop[]) {
    super();
    this.airdrops = TokenRecentSales;
  }

  public static fromObject = (obj: Record<string, unknown>): ListCollectionTokenAirdropsResponse => {
    return new ListCollectionTokenAirdropsResponse(
      (obj.airdrops as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.Airdrop.fromObject(innerObj)),
    );
  };
}
