import metadata from './metadata_consolidated.json';
import spritesMetadata from './metadata_consolidated_sprites.json';
import { Token, TokenAttribute, TokenCollection, TokenCollectionAttribute } from './model';

declare global {
  export interface Window {
    KRT_API_URL?: string;
    KRT_ENV?: string;
    KRT_PROJECT?: string;
  }
}

export const getProject = (): string => {
  return window.KRT_PROJECT ?? 'mdtp';
};

export const loadTokenCollectionFromFile = (): TokenCollection => {
  let collectionMetadata: Record<string, unknown>;
  if (getProject() === 'sprites') {
    collectionMetadata = spritesMetadata as Record<string, unknown>;
  } else {
    collectionMetadata = metadata as Record<string, unknown>;
  }
  const parsedTokens = (collectionMetadata.tokens as Record<string, unknown>[]).map((metadataObject: Record<string, unknown>): Token => {
    return {
      tokenId: metadataObject.tokenId as number,
      name: metadataObject.name as string,
      description: metadataObject.description as string,
      imageUrl: metadataObject.imageUrl as string,
      attributes: (metadataObject.attributes as Record<string, unknown>[] || []).map((attribute: Record<string, unknown>): TokenAttribute => {
        return {
          name: attribute.trait_type as string,
          value: attribute.value ? attribute.value as string : 'None',
        };
      }),
      attributeMap: (metadataObject.attributes as Record<string, unknown>[] || []).reduce((current: Record<string, string>, attribute: Record<string, unknown>): Record<string, string> => {
        // eslint-disable-next-line no-param-reassign
        current[attribute.trait_type as string] = attribute.value ? attribute.value as string : 'None';
        return current;
      }, {}),
    };
  });
  parsedTokens.sort((token1: Token, token2: Token): number => token1.tokenId - token2.tokenId);

  const tokenAttributes: Record<string, TokenCollectionAttribute> = {};
  parsedTokens.forEach((token: Token): void => {
    token.attributes.forEach((attribute: TokenAttribute): void => {
      let tokenAttribute = tokenAttributes[attribute.name];
      if (!tokenAttribute) {
        tokenAttribute = {
          name: attribute.name,
          tokenIds: [],
          values: {},
        };
        tokenAttributes[tokenAttribute.name] = tokenAttribute;
      }
      tokenAttribute.tokenIds.push(token.tokenId);
      let tokenValue = tokenAttribute.values[attribute.value];
      if (!tokenValue) {
        tokenValue = {
          name: attribute.value,
          tokenIds: [],
        };
        tokenAttribute.values[tokenValue.name] = tokenValue;
      }
      tokenValue.tokenIds.push(token.tokenId);
    });
  });

  const tokens = parsedTokens.reduce((current: Record<string, Token>, value: Token): Record<string, Token> => {
    // eslint-disable-next-line no-param-reassign
    current[value.tokenId] = value;
    return current;
  }, {});

  return {
    address: collectionMetadata.address as string,
    name: collectionMetadata.name as string | null,
    symbol: collectionMetadata.symbol as string | null,
    description: collectionMetadata.description as string | null,
    imageUrl: collectionMetadata.imageUrl as string | null,
    twitterUsername: collectionMetadata.twitterUsername as string | null,
    instagramUsername: collectionMetadata.instagramUsername as string | null,
    wikiUrl: collectionMetadata.wikiUrl as string | null,
    openseaSlug: collectionMetadata.openseaSlug as string | null,
    url: collectionMetadata.url as string | null,
    discordUrl: collectionMetadata.discordUrl as string | null,
    bannerImageUrl: collectionMetadata.bannerImageUrl as string | null,
    doesSupportErc721: collectionMetadata.doesSupportErc721 as boolean,
    doesSupportErc1155: collectionMetadata.doesSupportErc1155 as boolean,
    tokens,
    attributes: tokenAttributes,
  };
};
