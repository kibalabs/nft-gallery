
export interface TokenAttribute {
  name: string;
  value: string;
}

export interface Token {
  tokenId: string;
  name: string;
  description: string| null;
  imageUrl: string;
  frameImageUrl: string | null;
  attributes: TokenAttribute[];
  attributeMap: Record<string, string>;
}

export interface TokenCollectionAttributeValue {
  name: string;
  tokenIds: string[];
}

export interface TokenCollectionAttribute {
  name: string;
  tokenIds: string[];
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
  tokens: Record<string, Token>;
  attributes: Record<string, TokenCollectionAttribute>;
}
