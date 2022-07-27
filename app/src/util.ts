import { IBackgroundConfig } from '@kibalabs/ui-react';

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


export const getChain = (projectId: string): string | null => {
  if (projectId === 'pepes') {
    return 'avalanche';
  }
  return 'ethereum';
};


export const getBackground = (projectId: string): IBackgroundConfig | null => {
  if (projectId === 'sprites') {
    return {
      linearGradient: '180deg, rgba(89,190,144,1) 0%, rgba(211,163,181,1) 50%, rgba(220,137,117,1) 100%',
    };
  }
  if (projectId === 'pepes') {
    return {
      layers: [
        { imageUrl: '/assets/pepes/background.png' },
        { color: 'RGBA(96, 100, 85, 0.75)' },
      ],
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
  if (projectId === 'pepes') {
    return '/assets/pepes/logo.png';
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
  if (projectId === 'pepes') {
    return '/assets/pepes/icon.png';
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
  if (projectId === 'sprites') {
    return '23fecbad77194ba4aa49b4abb88c6131';
  }
  return null;
};


export const getCollectionAddress = (projectId: string): string | null => {
  if (projectId === 'mdtp') {
    return '0x8e720F90014fA4De02627f4A4e217B7e3942d5e8';
  }
  if (projectId === 'goblintown') {
    return '0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e';
  }
  if (projectId === 'sprites') {
    return '0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3';
  }
  return null;
};
