import { RequestData, ResponseData } from '@kibalabs/core';

import * as Resources from './resources';


export class GetCollectionRequest extends RequestData {
}

export class GetCollectionResponse extends ResponseData {
  readonly collection: Resources.Collection;

  public constructor(collection: Resources.Collection) {
    super();
    this.collection = collection;
  }

  public static fromObject = (obj: Record<string, unknown>): GetCollectionResponse => {
    return new GetCollectionResponse(
      Resources.Collection.fromObject(obj.collection as Record<string, unknown>),
    );
  };
}

export class ListCollectionAttributesRequest extends RequestData {
}

export class ListCollectionAttributesResponse extends ResponseData {
  readonly attributes: Resources.CollectionAttribute[];

  public constructor(attributes: Resources.CollectionAttribute[]) {
    super();
    this.attributes = attributes;
  }

  public static fromObject = (obj: Record<string, unknown>): ListCollectionAttributesResponse => {
    return new ListCollectionAttributesResponse(
      (obj.attributes as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.CollectionAttribute.fromObject(innerObj)),
    );
  };
}

export class ListTokenRecentTransfersRequest extends RequestData {
}

export class ListTokenRecentTransfersResponse extends ResponseData {
  readonly tokenTransfers: Resources.TokenTransfer[];

  public constructor(tokenTransfers: Resources.TokenTransfer[]) {
    super();
    this.tokenTransfers = tokenTransfers;
  }

  public static fromObject = (obj: Record<string, unknown>): ListTokenRecentTransfersResponse => {
    return new ListTokenRecentTransfersResponse(
      (obj.tokenTransfers as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.TokenTransfer.fromObject(innerObj)),
    );
  };
}

export class ListCollectionTokensByOwnersRequest extends RequestData {
}

export class ListCollectionTokensByOwnersResponse extends ResponseData {
  readonly tokens: Resources.CollectionToken[];

  public constructor(tokens: Resources.CollectionToken[]) {
    super();
    this.tokens = tokens;
  }

  public static fromObject = (obj: Record<string, unknown>): ListCollectionTokensByOwnersResponse => {
    return new ListCollectionTokensByOwnersResponse(
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

  public constructor(airdrops: Resources.Airdrop[]) {
    super();
    this.airdrops = airdrops;
  }

  public static fromObject = (obj: Record<string, unknown>): ListCollectionTokenAirdropsResponse => {
    return new ListCollectionTokenAirdropsResponse(
      (obj.airdrops as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.Airdrop.fromObject(innerObj)),
    );
  };
}

export class InQueryParam extends RequestData {
  readonly fieldName: string;
  readonly values: string[];

  public constructor(fieldName: string, values: string[]) {
    super();
    this.fieldName = fieldName;
    this.values = values;
  }

  public toObject = (): Record<string, unknown> => {
    return {
      fieldName: this.fieldName,
      values: this.values,
    };
  }
}

export class QueryCollectionTokensRequest extends RequestData {
  readonly limit?: number;
  readonly offset?: number;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly isListed?: boolean;
  readonly tokenIdIn?: string[];
  readonly attributeFilters?: InQueryParam[];

  public constructor(limit?: number, offset?: number, minPrice?: number, maxPrice?: number, isListed?: boolean, tokenIdIn?: string[], attributeFilters?: InQueryParam[]) {
    super();
    this.limit = limit;
    this.offset = offset;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.isListed = isListed;
    this.tokenIdIn = tokenIdIn;
    this.attributeFilters = attributeFilters;
  }

  public toObject = (): Record<string, unknown> => {
    return {
      limit: this.limit,
      offset: this.offset,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      isListed: this.isListed,
      tokenIdIn: this.tokenIdIn,
      attributeFilters: this.attributeFilters?.map((param: InQueryParam): Record<string, unknown> => param.toObject()),
    };
  };
}

export class QueryCollectionTokensResponse extends ResponseData {
  readonly tokens: Resources.CollectionToken[];

  public constructor(tokens: Resources.CollectionToken[]) {
    super();
    this.tokens = tokens;
  }

  public static fromObject = (obj: Record<string, unknown>): ListCollectionTokensByOwnersResponse => {
    return new ListCollectionTokensByOwnersResponse(
      (obj.tokens as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.CollectionToken.fromObject(innerObj)),
    );
  };
}
