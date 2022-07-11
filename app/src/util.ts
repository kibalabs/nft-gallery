import { IBackgroundConfig } from '@kibalabs/ui-react';

import { Token, TokenAttribute, TokenCollection, TokenCollectionAttribute } from './model';

export interface IProjectConfig {
  projectId: string;
  name: string;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const getTreasureHuntTokenId = (projectId: string): string | null => {
  return null;
};

export const getBannerImageUrl = (projectId: string): string | null => {
  if (projectId === 'sprites') {
    return '/assets/sprites/banner.png';
  }
  return null;
};

export const getHost = (projectId: string): string | null => {
  if (projectId === 'sprites') {
    return 'https://gallery.spriteclubnft.com';
  }
  if (projectId === 'goblintown') {
    return 'https://goblintown-gallery.tokenpage.xyz';
  }
  if (projectId === 'mdtp') {
    return 'https://gallery.milliondollartokenpage.com';
  }
  return null;
};

export const getBackground = (projectId: string): IBackgroundConfig | null => {
  if (projectId === 'sprites') {
    return {
      linearGradient: '180deg, rgba(89,190,144,1) 0%, rgba(211,163,181,1) 50%, rgba(220,137,117,1) 100%',
    };
  }
  if (projectId === 'goblintown') {
    return {
      layers: [
        { imageUrl: '/assets/goblintown/background.png' },
        { color: 'rgba(0, 0, 0, 0.75)' },
      ],
    };
  }
  return null;
};

export const getLogoImageUrl = (projectId: string): string | null => {
  if (projectId === 'sprites') {
    return '/assets/sprites/logo.png';
  }
  if (projectId === 'goblintown') {
    return '/assets/goblintown/logo-animated-inverse.gif';
  }
  return null;
};

export const getBackgroundMusic = (projectId: string): string | null => {
  if (projectId === 'goblintown') {
    return '/assets/goblintown/music.mp3';
  }
  return null;
};

export const getIcon = (projectId: string): string | null => {
  if (projectId === 'sprites') {
    return '/assets/sprites/icon.png';
  }
  if (projectId === 'goblintown') {
    return '/assets/goblintown/icon.png';
  }
  if (projectId === 'mdtp') {
    return '/assets/mdtp/icon.png';
  }
  return null;
};

export const getEveryviewCode = (projectId: string): string | null => {
  if (projectId === 'mdtp') {
    return '54fa4b47b0b3431884b64a549d46ffd7';
  }
  if (projectId === 'goblintown') {
    return 'eb42bb3312374c8982d92c3eb38f84e7';
  }
  return null;
};

export const loadTokenCollection = (collectionMetadata: Record<string, unknown>): TokenCollection => {
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
  };
};
