import { RequestData, ResponseData } from '@kibalabs/core';
import { BigNumber } from 'ethers';

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


export class GetCollectionTokenRequest extends RequestData {
}

export class GetCollectionTokenResponse extends ResponseData {
  readonly token: Resources.CollectionToken;

  public constructor(token: Resources.CollectionToken) {
    super();
    this.token = token;
  }

  public static fromObject = (obj: Record<string, unknown>): GetCollectionTokenResponse => {
    return new GetCollectionTokenResponse(
      Resources.CollectionToken.fromObject(obj.token as Record<string, unknown>),
    );
  };
}


export class GetGalleryTokenRequest extends RequestData {
}

export class GetGalleryTokenResponse extends ResponseData {
  readonly galleryToken: Resources.GalleryToken;

  public constructor(galleryToken: Resources.GalleryToken) {
    super();
    this.galleryToken = galleryToken;
  }

  public static fromObject = (obj: Record<string, unknown>): GetGalleryTokenResponse => {
    return new GetGalleryTokenResponse(
      Resources.GalleryToken.fromObject(obj.galleryToken as Record<string, unknown>),
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


export class ListTokenOwnershipsRequest extends RequestData {
}

export class ListTokenOwnershipsResponse extends ResponseData {
  readonly tokenOwnerships: Resources.TokenOwnership[];

  public constructor(tokenOwnerships: Resources.TokenOwnership[]) {
    super();
    this.tokenOwnerships = tokenOwnerships;
  }

  public static fromObject = (obj: Record<string, unknown>): ListTokenOwnershipsResponse => {
    return new ListTokenOwnershipsResponse(
      (obj.tokenOwnerships as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.TokenOwnership.fromObject(innerObj)),
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
  };
}

export class QueryCollectionTokensRequest extends RequestData {
  readonly limit?: number;
  readonly offset?: number;
  readonly ownerAddress?: string;
  readonly minPrice?: BigNumber;
  readonly maxPrice?: BigNumber;
  readonly isListed?: boolean;
  readonly tokenIdIn?: string[];
  readonly attributeFilters?: InQueryParam[];

  public constructor(limit?: number, offset?: number, ownerAddress?: string, minPrice?: BigNumber, maxPrice?: BigNumber, isListed?: boolean, tokenIdIn?: string[], attributeFilters?: InQueryParam[]) {
    super();
    this.limit = limit;
    this.offset = offset;
    this.ownerAddress = ownerAddress;
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
      ownerAddress: this.ownerAddress,
      minPrice: this.minPrice ? this.minPrice.toString() : null,
      maxPrice: this.maxPrice ? this.maxPrice.toString() : null,
      isListed: this.isListed,
      tokenIdIn: this.tokenIdIn,
      attributeFilters: this.attributeFilters?.map((param: InQueryParam): Record<string, unknown> => param.toObject()),
    };
  };
}

export class QueryCollectionTokensResponse extends ResponseData {
  readonly galleryTokens: Resources.GalleryToken[];

  public constructor(galleryTokens: Resources.GalleryToken[]) {
    super();
    this.galleryTokens = galleryTokens;
  }

  public static fromObject = (obj: Record<string, unknown>): QueryCollectionTokensResponse => {
    return new QueryCollectionTokensResponse(
      (obj.galleryTokens as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.GalleryToken.fromObject(innerObj)),
    );
  };
}


export class CreateCustomizationForCollectionTokenRequest extends RequestData {
  public constructor(
    readonly creatorAddress: string,
    readonly signature: string,
    readonly blockNumber: number,
    readonly name: string | null,
    readonly description: string | null,
  ) {
    super();
  }

  public toObject = (): Record<string, unknown> => {
    return {
      creatorAddress: this.creatorAddress,
      signature: this.signature,
      blockNumber: this.blockNumber,
      name: this.name,
      description: this.description,
    };
  };
}

export class CreateCustomizationForCollectionTokenResponse extends ResponseData {
  readonly tokenCustomization: Resources.TokenCustomization;

  public constructor(tokenCustomization: Resources.TokenCustomization) {
    super();
    this.tokenCustomization = tokenCustomization;
  }

  public static fromObject = (obj: Record<string, unknown>): CreateCustomizationForCollectionTokenResponse => {
    return new CreateCustomizationForCollectionTokenResponse(
      Resources.TokenCustomization.fromObject(obj.tokenCustomization as Record<string, unknown>),
    );
  };
}

export class GetGalleryCollectionUserRequest extends RequestData {
}

export class GetGalleryCollectionUserResponse extends ResponseData {
  readonly galleryUser: Resources.GalleryUser;

  public constructor(galleryUser: Resources.GalleryUser) {
    super();
    this.galleryUser = galleryUser;
  }

  public static fromObject = (obj: Record<string, unknown>): GetGalleryCollectionUserResponse => {
    return new GetGalleryCollectionUserResponse(
      Resources.GalleryUser.fromObject(obj.galleryUser as Record<string, unknown>),
    );
  };
}

export class QueryCollectionUsersRequest extends RequestData {
  readonly limit?: number;
  readonly offset?: number;
  readonly order?: string;

  public constructor(limit?: number, offset?: number, order?: string) {
    super();
    this.limit = limit;
    this.offset = offset;
    this.order = order;
  }

  public toObject = (): Record<string, unknown> => {
    return {
      limit: this.limit,
      offset: this.offset,
      order: this.order,
    };
  };
}

export class QueryCollectionUsersResponse extends ResponseData {
  readonly galleryUserRowListResponse: Resources.ListResponse<Resources.GalleryUserRow>;

  public constructor(galleryUserRowListResponse: Resources.ListResponse<Resources.GalleryUserRow>) {
    super();
    this.galleryUserRowListResponse = galleryUserRowListResponse;
  }

  public static fromObject = (obj: Record<string, unknown>): QueryCollectionUsersResponse => {
    return new QueryCollectionUsersResponse(
      Resources.ListResponse.fromObject(obj.galleryUserRowListResponse as Record<string, unknown>, Resources.GalleryUserRow),
    );
  };
}

export class FollowGalleryUserRequest extends RequestData {
  readonly account: string;
  readonly signatureMessage: string;
  readonly signature: string;

  public constructor(account: string, signatureMessage: string, signature: string) {
    super();
    this.account = account;
    this.signatureMessage = signatureMessage;
    this.signature = signature;
  }

  public toObject = (): Record<string, unknown> => {
    return {
      account: this.account,
      signatureMessage: this.signatureMessage,
      signature: this.signature,
    };
  };
}

export class FollowGalleryUserResponse extends ResponseData {
  // eslint-disable-next-line unused-imports/no-unused-vars
  public static fromObject = (obj: Record<string, unknown>): FollowGalleryUserResponse => {
    return new FollowGalleryUserResponse();
  };
}


export class GetCollectionRecentTransfersRequest extends RequestData {
  readonly userAddress?: string;
  readonly limit?: number;
  readonly offset?: number;

  constructor(userAddress?: string, limit?: number, offset?: number) {
    super();
    this.userAddress = userAddress;
    this.limit = limit;
    this.offset = offset;
  }

  public toObject = (): Record<string, unknown> => {
    return {
      userAddress: this.userAddress,
      limit: this.limit,
      offset: this.offset,
    };
  };
}

export class GetCollectionRecentTransfersResponse extends ResponseData {
  readonly tokenTransfers: Resources.TokenTransfer[];

  public constructor(tokenTransfers: Resources.TokenTransfer[]) {
    super();
    this.tokenTransfers = tokenTransfers;
  }

  public static fromObject = (obj: Record<string, unknown>): GetCollectionRecentTransfersResponse => {
    return new GetCollectionRecentTransfersResponse(
      (obj.tokenTransfers as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.TokenTransfer.fromObject(innerObj)),
    );
  };
}


export class GetGalleryUserOwnedCollectionsRequest extends RequestData {
}

export class GetGalleryUserOwnedCollectionsResponse extends ResponseData {
  readonly ownedCollections: Resources.GalleryOwnedCollection[];

  public constructor(ownedCollections: Resources.GalleryOwnedCollection[]) {
    super();
    this.ownedCollections = ownedCollections;
  }

  public static fromObject = (obj: Record<string, unknown>): GetGalleryUserOwnedCollectionsResponse => {
    return new GetGalleryUserOwnedCollectionsResponse(
      (obj.ownedCollections as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => Resources.GalleryOwnedCollection.fromObject(innerObj)),
    );
  };
}
