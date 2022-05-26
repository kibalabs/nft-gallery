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
  public static fromObject = (obj: Record<string, unknown>): SubmitTreasureHuntForCollectionTokenResponse => {
    return new SubmitTreasureHuntForCollectionTokenResponse(
    );
  }
}
