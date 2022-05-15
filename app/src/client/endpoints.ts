import { RequestData, ResponseData } from '@kibalabs/core';

import * as Resources from './resources';

export class GetTokenRecentSalesRequest extends RequestData {
}

export class GetTokenRecentSalesResponse extends ResponseData {
  readonly tokenTransfers: Resources.TokenTransfer[];

  public constructor(TokenRecentSales: Resources.TokenTransfer[]) {
    super();
    this.tokenTransfers = TokenRecentSales;
  }

  public static fromObject = (obj: Record<string, unknown>): GetTokenRecentSalesResponse => {
    return new GetTokenRecentSalesResponse(
      (obj.tokenTransfers as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.TokenTransfer.fromObject(innerObj)),
    );
  };
}
