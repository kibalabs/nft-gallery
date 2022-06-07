import { IBackgroundConfig } from '@kibalabs/ui-react';

import goblintownMetadata from './metadata_consolidated_goblintown.json';
import metadata from './metadata_consolidated_mdtp.json';
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

export const getTreasureHuntTokenId = (): string | null => {
  if (getProject() === 'sprites') {
    return '101';
  }
  return null;
};

export const getBackground = (): IBackgroundConfig | null => {
  if (getProject() === 'goblintown') {
    return {
      layers: [
        { imageUrl: '/assets/goblintown/background.png' },
        { color: 'rgba(0, 0, 0, 0.75)' },
      ],
    };
  }
  return null;
};

export const getLogoImageUrl = (): string | null => {
  if (getProject() === 'goblintown') {
    return '/assets/goblintown/logo-animated-inverse.gif';
  }
  return null;
};

export const getBackgroundMusic = (): string | null => {
  if (getProject() === 'goblintown') {
    return '/assets/goblintown/music.mp3';
  }
  return null;
};

export const getIcon = (): string | null => {
  if (getProject() === 'goblintown') {
    return '/assets/goblintown/icon.png';
  }
  return null;
};

export const loadTokenCollectionFromFile = (): TokenCollection => {
  let collectionMetadata: Record<string, unknown>;
  if (getProject() === 'sprites') {
    collectionMetadata = spritesMetadata as Record<string, unknown>;
  } else if (getProject() === 'goblintown') {
    collectionMetadata = goblintownMetadata as Record<string, unknown>;
  } else {
    collectionMetadata = metadata as Record<string, unknown>;
  }
  const parsedTokens = (collectionMetadata.tokens as Record<string, unknown>[]).map((metadataObject: Record<string, unknown>): Token => {
    return {
      tokenId: String(metadataObject.tokenId),
      name: String(metadataObject.name),
      description: metadataObject.description ? String(metadataObject.description) : null,
      imageUrl: String(metadataObject.imageUrl),
      frameImageUrl: metadataObject.frameImageUrl ? String(metadataObject.frameImageUrl) : null,
      attributes: (metadataObject.attributes as Record<string, unknown>[] || []).map((attribute: Record<string, unknown>): TokenAttribute => {
        return {
          name: String(attribute.trait_type),
          value: attribute.value ? String(attribute.value) : 'None',
        };
      }),
      attributeMap: (metadataObject.attributes as Record<string, unknown>[] || []).reduce((current: Record<string, string>, attribute: Record<string, unknown>): Record<string, string> => {
        // eslint-disable-next-line no-param-reassign
        current[attribute.trait_type as string] = attribute.value ? attribute.value as string : 'None';
        return current;
      }, {}),
    };
  });
  // parsedTokens.sort((token1: Token, token2: Token): number => token1.tokenId - token2.tokenId);

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
    frameImageUrl: collectionMetadata.frameImageUrl as string | null,
  };
};
