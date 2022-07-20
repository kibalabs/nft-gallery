import { dateFromString } from '@kibalabs/core';
import { BigNumber } from 'ethers';

export class TokenTransfer {
  // eslint-disable-next-line no-useless-constructor
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
  // eslint-disable-next-line no-empty-function
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

export class Collection {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    readonly address: string,
    readonly name: string | null,
    readonly imageUrl: string | null,
    readonly description: string | null,
    readonly url: string | null,
    readonly openseaSlug: string | null,
    readonly bannerImageUrl: string | null,
    readonly discordUrl: string | null,
    readonly instagramUsername: string | null,
    readonly twitterUsername: string | null,
  // eslint-disable-next-line no-empty-function
  ) {}

  public static fromObject = (obj: Record<string, unknown>): Collection => {
    return new Collection(
      String(obj.address),
      obj.name ? String(obj.name) : null,
      obj.imageUrl ? String(obj.imageUrl) : null,
      obj.description ? String(obj.description) : null,
      obj.url ? String(obj.url) : null,
      obj.openseaSlug ? String(obj.openseaSlug) : null,
      obj.bannerImageUrl ? String(obj.bannerImageUrl) : null,
      obj.discordUrl ? String(obj.discordUrl) : null,
      obj.instagramUsername ? String(obj.instagramUsername) : null,
      obj.twitterUsername ? String(obj.twitterUsername) : null,
    );
  };
}


export class CollectionAttribute {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    readonly name: string,
    readonly values: string[],
  // eslint-disable-next-line no-empty-function
  ) {}

  public static fromObject = (obj: Record<string, unknown>): CollectionAttribute => {
    return new CollectionAttribute(
      String(obj.name),
      ((obj.values as unknown[]).map((value: unknown): string => String(value))),
    );
  };
}

export class TokenAttribute {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    readonly traitType: string,
    readonly value: string,
  // eslint-disable-next-line no-empty-function
  ) {}

  public static fromObject = (obj: Record<string, unknown>): TokenAttribute => {
    return new TokenAttribute(
      String(obj.trait_type),
      String(obj.value),
    );
  };
}

export class CollectionToken {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    readonly registryAddress: string,
    readonly tokenId: string,
    readonly name: string,
    readonly imageUrl: string | null,
    readonly frameImageUrl: string | null,
    readonly description: string | null,
    readonly attributes: TokenAttribute[],
  // eslint-disable-next-line no-empty-function
  ) {}

  public static fromObject = (obj: Record<string, unknown>): CollectionToken => {
    return new CollectionToken(
      String(obj.registryAddress),
      String(obj.tokenId),
      String(obj.name),
      obj.imageUrl ? String(obj.imageUrl) : null,
      obj.frameImageUrl ? String(obj.frameImageUrl) : null,
      obj.description ? String(obj.description) : null,
      (obj.attributes as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => TokenAttribute.fromObject(innerObj)),
    );
  };
}

export class Airdrop {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    readonly token: CollectionToken,
    readonly name: string,
    readonly isClaimed: boolean,
    readonly claimToken: CollectionToken,
    readonly claimUrl: string,
  // eslint-disable-next-line no-empty-function
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

export class TokenListing {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    readonly tokenListingId: number,
    readonly token: CollectionToken,
    readonly offererAddress: string,
    readonly startDate: Date,
    readonly endDate: Date,
    readonly isValueNative: boolean,
    readonly value: BigNumber,
    readonly source: string,
    readonly sourceId: string,
  // eslint-disable-next-line no-empty-function
  ) {}

  public static fromObject = (obj: Record<string, unknown>): TokenListing => {
    return new TokenListing(
      Number(obj.tokenListingId),
      CollectionToken.fromObject(obj.token as Record<string, unknown>),
      String(obj.offererAddress),
      dateFromString(String(obj.startDate)),
      dateFromString(String(obj.endDate)),
      Boolean(obj.isValueNative),
      BigNumber.from(String(obj.value)),
      String(obj.source),
      String(obj.sourceId),
    );
  };
}
