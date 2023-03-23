import { dateFromString, ResponseData } from '@kibalabs/core';
import { BigNumber } from 'ethers';

export class TokenTransfer extends ResponseData {
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
    readonly token: CollectionToken,
    readonly isMultiAddress: boolean,
    readonly isInterstitial: boolean,
    readonly isSwap: boolean,
    readonly isBatch: boolean,
    readonly isOutbound: boolean,

  ) { super(); }

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
      CollectionToken.fromObject(obj.token as Record<string, unknown>),
      Boolean(obj.isMultiAddress),
      Boolean(obj.isInterstitial),
      Boolean(obj.isSwap),
      Boolean(obj.isBatch),
      Boolean(obj.isOutbound),
    );
  };
}

export class Collection extends ResponseData {
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
    readonly doesSupportErc721: boolean,
    readonly doesSupportErc1155: boolean,
  ) { super(); }

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
      Boolean(obj.doesSupportErc721),
      Boolean(obj.doesSupportErc1155),
    );
  };
}


export class CollectionAttribute extends ResponseData {
  public constructor(
    readonly name: string,
    readonly values: string[],

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): CollectionAttribute => {
    return new CollectionAttribute(
      String(obj.name),
      ((obj.values as unknown[]).map((value: unknown): string => String(value))),
    );
  };
}


export class SuperCollectionEntry extends ResponseData {
  public constructor(
    readonly collection: Collection,
    readonly collectionAttributes: CollectionAttribute[],

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): SuperCollectionEntry => {
    return new SuperCollectionEntry(
      Collection.fromObject(obj.collection as Record<string, unknown>),
      (obj.collectionAttributes as Record<string, unknown>[]).map((innerObj: Record<string, unknown>): CollectionAttribute => CollectionAttribute.fromObject(innerObj)),
    );
  };
}

export class TokenAttribute extends ResponseData {
  public constructor(
    readonly traitType: string,
    readonly value: string,

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): TokenAttribute => {
    return new TokenAttribute(
      String(obj.trait_type),
      String(obj.value),
    );
  };
}

export class CollectionToken extends ResponseData {
  public constructor(
    readonly registryAddress: string,
    readonly tokenId: string,
    readonly name: string,
    readonly imageUrl: string | null,
    readonly frameImageUrl: string | null,
    readonly resizableImageUrl: string | null,
    readonly description: string | null,
    readonly attributes: TokenAttribute[],

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): CollectionToken => {
    return new CollectionToken(
      String(obj.registryAddress),
      String(obj.tokenId),
      String(obj.name),
      obj.imageUrl ? String(obj.imageUrl) : null,
      obj.frameImageUrl ? String(obj.frameImageUrl) : null,
      obj.resizableImageUrl ? String(obj.resizableImageUrl) : null,
      obj.description ? String(obj.description) : null,
      (obj.attributes as Record<string, unknown>[]).map((innerObj: Record<string, unknown>) => TokenAttribute.fromObject(innerObj)),
    );
  };
}

export class Airdrop extends ResponseData {
  public constructor(
    readonly token: CollectionToken,
    readonly name: string,
    readonly isClaimed: boolean,
    readonly claimToken: CollectionToken,
    readonly claimUrl: string,

  ) { super(); }

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

export class TokenListing extends ResponseData {
  public constructor(
    readonly tokenListingId: number,
    readonly registryAddress: string,
    readonly tokenId: string,
    readonly offererAddress: string,
    readonly startDate: Date,
    readonly endDate: Date,
    readonly isValueNative: boolean,
    readonly value: BigNumber,
    readonly source: string,
    readonly sourceId: string,

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): TokenListing => {
    return new TokenListing(
      Number(obj.tokenListingId),
      String(obj.registryAddress),
      String(obj.tokenId),
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


export class TokenOwnership extends ResponseData {
  public constructor(
    readonly registryAddress: string,
    readonly tokenId: string,
    readonly ownerAddress: string,
    readonly quantity: BigNumber,

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): TokenOwnership => {
    return new TokenOwnership(
      String(obj.registryAddress),
      String(obj.tokenId),
      String(obj.ownerAddress),
      BigNumber.from(String(obj.quantity)),
    );
  };
}


export class TokenCustomization extends ResponseData {
  public constructor(
    readonly tokenCustomizationId: number,
    readonly createdDate: Date,
    readonly updatedDate: Date,
    readonly registryAddress: string,
    readonly tokenId: string,
    readonly creatorAddress: string,
    readonly blockNumber: number,
    readonly signature: string,
    readonly name: string | null,
    readonly description: string | null,

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): TokenCustomization => {
    return new TokenCustomization(
      Number(obj.tokenCustomizationId),
      dateFromString(String(obj.createdDate)),
      dateFromString(String(obj.updatedDate)),
      String(obj.registryAddress),
      String(obj.tokenId),
      String(obj.creatorAddress),
      Number(obj.blockNumber),
      String(obj.signature),
      obj.name ? String(obj.name) : null,
      obj.description ? String(obj.description) : null,
    );
  };
}


export class GalleryToken extends ResponseData {
  public constructor(
    readonly collectionToken: CollectionToken,
    readonly tokenCustomization: TokenCustomization | null,
    readonly tokenListing: TokenListing | null,
    readonly quantity: number,
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): GalleryToken => {
    return new GalleryToken(
      CollectionToken.fromObject(obj.collectionToken as Record<string, unknown>),
      obj.tokenCustomization ? TokenCustomization.fromObject(obj.tokenCustomization as Record<string, unknown>) : null,
      obj.tokenListing ? TokenListing.fromObject(obj.tokenListing as Record<string, unknown>) : null,
      Number(obj.quantity),
    );
  };
}

export class UserProfile extends ResponseData {
  public constructor(
    readonly address: string,
    readonly twitterId: string | null,
    readonly discordId: string | null,

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): UserProfile => {
    return new UserProfile(
      String(obj.address),
      obj.twitterId ? String(obj.twitterId) : null,
      obj.discordId ? String(obj.discordId) : null,
    );
  };
}

export class TwitterProfile extends ResponseData {
  public constructor(
    readonly twitterId: string,
    readonly username: string,
    readonly name: string,
    readonly description: string,
    readonly isVerified: boolean,
    readonly pinnedTweetId: string | null,
    readonly followerCount: number,
    readonly followingCount: number,
    readonly tweetCount: number,

  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): TwitterProfile => {
    return new TwitterProfile(
      String(obj.twitterId),
      String(obj.username),
      String(obj.name),
      String(obj.description),
      Boolean(obj.isVerified),
      obj.pinnedTweetId ? String(obj.pinnedTweetId) : null,
      Number(obj.followerCount),
      Number(obj.followingCount),
      Number(obj.tweetCount),
    );
  };
}

export class GalleryUser extends ResponseData {
  public constructor(
    readonly address: string,
    readonly registryAddress: string,
    readonly userProfile: UserProfile | null,
    readonly twitterProfile: TwitterProfile | null,
    readonly joinDate: Date | null,
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): GalleryUser => {
    return new GalleryUser(
      String(obj.address),
      String(obj.registryAddress),
      obj.userProfile ? UserProfile.fromObject(obj.userProfile as Record<string, unknown>) : null,
      obj.twitterProfile ? TwitterProfile.fromObject(obj.twitterProfile as Record<string, unknown>) : null,
      obj.joinDate ? dateFromString(obj.joinDate as string) : null,
    );
  };
}


export class GalleryUserRow extends ResponseData {
  public constructor(
    readonly galleryUser: GalleryUser,
    readonly ownedTokenCount: number,
    readonly uniqueOwnedTokenCount: number,
    readonly chosenOwnedTokens: CollectionToken[],
    readonly galleryUserBadges: GalleryUserBadge[],
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): GalleryUserRow => {
    return new GalleryUserRow(
      GalleryUser.fromObject(obj.galleryUser as Record<string, unknown>),
      Number(obj.ownedTokenCount),
      Number(obj.uniqueOwnedTokenCount),
      (obj.chosenOwnedTokens as Record<string, unknown>[]).map((innerObj: Record<string, unknown>): CollectionToken => CollectionToken.fromObject(innerObj)),
      (obj.galleryUserBadges as Record<string, unknown>[]).map((innerObj: Record<string, unknown>): GalleryUserBadge => GalleryUserBadge.fromObject(innerObj)),
    );
  };
}


export class GallerySuperCollectionUserRow extends ResponseData {
  public constructor(
    readonly galleryUser: GalleryUser,
    readonly ownedTokenCountMap: Record<string, number>,
    readonly uniqueOwnedTokenCountMap: Record<string, number>,
    readonly chosenOwnedTokensMap: Record<string, CollectionToken[]>,
    readonly galleryUserBadges: GalleryUserBadge[],
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): GallerySuperCollectionUserRow => {
    return new GallerySuperCollectionUserRow(
      GalleryUser.fromObject(obj.galleryUser as Record<string, unknown>),
      (obj.ownedTokenCountMap as Record<string, number>),
      (obj.uniqueOwnedTokenCountMap as Record<string, number>),
      Object.keys((obj.chosenOwnedTokensMap as Record<string, unknown>)).reduce((accumulator: Record<string, CollectionToken[]>, current: string): Record<string, CollectionToken[]> => {
        accumulator[current] = ((obj.chosenOwnedTokensMap as Record<string, Record<string, unknown>[]>)[current]).map((innerObj: Record<string, unknown>): CollectionToken => CollectionToken.fromObject(innerObj));
        return accumulator;
      }, {}),
      (obj.galleryUserBadges as Record<string, unknown>[]).map((innerObj: Record<string, unknown>): GalleryUserBadge => GalleryUserBadge.fromObject(innerObj)),
    );
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;


export class ListResponse<ItemType extends ResponseData> extends ResponseData {
  public constructor(
    readonly items: ItemType[],
    readonly totalCount: number,

  ) { super(); }

  public static fromObject = <ItemTypeInner extends ResponseData>(obj: Record<string, unknown>, responseClass: Constructor<ItemTypeInner>): ListResponse<ItemTypeInner> => {
    return new ListResponse<ItemTypeInner>(
      // @ts-ignore
      (obj.items as Record<string, unknown>[]).map((innerObj: Record<string, unknown>): ItemTypeInner => responseClass.fromObject(innerObj)),
      Number(obj.totalCount),
    );
  };
}


export class GalleryOwnedCollection extends ResponseData {
  public constructor(
    readonly collection: Collection,
    readonly tokens: CollectionToken[],
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): GalleryOwnedCollection => {
    return new GalleryOwnedCollection(
      Collection.fromObject(obj.collection as Record<string, unknown>),
      (obj.tokens as Record<string, unknown>[]).map((innerObj: Record<string, unknown>): CollectionToken => CollectionToken.fromObject(innerObj)),
    );
  };
}

export class CollectionOverlap extends ResponseData {
  public constructor(
    readonly registryAddress: string,
    readonly otherRegistryAddress: string,
    readonly ownerAddress: string,
    readonly registryTokenCount: number,
    readonly otherRegistryTokenCount: number,
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): CollectionOverlap => {
    return new CollectionOverlap(
      String(obj.registryAddress),
      String(obj.otherRegistryAddress),
      String(obj.ownerAddress),
      Number(obj.registryTokenCount),
      Number(obj.otherRegistryTokenCount),
    );
  };
}


// class ApiSuperCollectionOverlap(BaseModel):
//     ownerAddress: str
//     otherRegistryAddress: str
//     otherRegistryTokenCount: int
//     registryTokenCountMap: Dict[str, int]

export class SuperCollectionOverlap extends ResponseData {
  public constructor(
    readonly ownerAddress: string,
    readonly otherRegistryAddress: string,
    readonly otherRegistryTokenCount: number,
    readonly registryTokenCountMap: Record<string, number>,
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): SuperCollectionOverlap => {
    return new SuperCollectionOverlap(
      String(obj.ownerAddress),
      String(obj.otherRegistryAddress),
      Number(obj.otherRegistryTokenCount),
      Object.keys(obj.registryTokenCountMap as Record<string, unknown>).reduce((accumulator: Record<string, number>, current: string): Record<string, number> => {
        accumulator[current] = Number((obj.registryTokenCountMap as Record<string, unknown>)[current]);
        return accumulator;
      }, {}),
    );
  };
}

export class CollectionOverlapSummary extends ResponseData {
  public constructor(
    readonly registryAddress: string,
    readonly otherCollection: Collection,
    readonly ownerCount: number,
    readonly registryTokenCount: number,
    readonly otherRegistryTokenCount: number,
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): CollectionOverlapSummary => {
    return new CollectionOverlapSummary(
      String(obj.registryAddress),
      Collection.fromObject(obj.otherCollection as Record<string, unknown>),
      Number(obj.ownerCount),
      Number(obj.registryTokenCount),
      Number(obj.otherRegistryTokenCount),
    );
  };
}

export class GalleryUserBadge extends ResponseData {
  public constructor(
    readonly registryAddress: string,
    readonly ownerAddress: string,
    readonly badgeKey: string,
    readonly achievedDate: Date,
  ) { super(); }

  public static fromObject = (obj: Record<string, unknown>): GalleryUserBadge => {
    return new GalleryUserBadge(
      String(obj.registryAddress),
      String(obj.ownerAddress),
      String(obj.badgeKey),
      dateFromString(obj.achievedDate as string),
    );
  };
}
