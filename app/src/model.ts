
export interface TokenAttribute {
  name: string;
  value: string;
}

export interface Token {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  attributes: TokenAttribute[];
  attributeMap: Record<string, string>;
  frameImageUrl: string;
}

export interface TokenCollectionAttributeValue {
  name: string;
  tokenIds: number[];
}

export interface TokenCollectionAttribute {
  name: string;
  tokenIds: number[];
  values: Record<string, TokenCollectionAttributeValue>;
}

export interface TokenCollection {
  address: string
  name: string | null;
  symbol: string | null;
  description: string | null;
  imageUrl: string | null;
  twitterUsername: string | null;
  instagramUsername: string | null;
  wikiUrl: string | null;
  openseaSlug: string | null;
  url: string | null;
  discordUrl: string | null;
  bannerImageUrl: string | null;
  doesSupportErc721: boolean;
  doesSupportErc1155: boolean;
  tokens: Record<number, Token>;
  attributes: Record<string, TokenCollectionAttribute>;
  frameImageUrl: string | null;
}
