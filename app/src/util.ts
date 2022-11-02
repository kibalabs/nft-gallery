import { IBackgroundConfig } from '@kibalabs/ui-react';

import GoblintownConfigJson from './projects/goblintown.json';
import MdtpConfigJson from './projects/mdtp.json';
import PepesConfigJson from './projects/pepes.json';
import RudeboysConfigJson from './projects/rudeboys.json';
import SpritesConfigJson from './projects/sprites.json';


export interface IBadge {
  key: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface IProjectConfig {
  projectId: string;
  name: string;
  host: string;
  chain: string;
  isCustomizationEnabled: boolean;
  backgroundConfig: IBackgroundConfig | null;
  backgroundMusingFileUrl: string | null,
  logoImageUrl: string;
  bannerImageUrl: string | null;
  iconImageUrl: string | null;
  everyviewCode: string | null;
  collectionAddress: string | null;
  defaultMembersSort: string | null;
  isBadgesEnabled: boolean;
  badges: IBadge[];
}

const RUDEBOYS_CONFIG = RudeboysConfigJson as IProjectConfig;
const SPRITES_CONFIG = SpritesConfigJson as IProjectConfig;
const MDTP_CONFIG = MdtpConfigJson as IProjectConfig;
const GOBLINTOWN_CONFIG = GoblintownConfigJson as IProjectConfig;
const PEPES_CONFIG = PepesConfigJson as IProjectConfig;

const PROJECT_CONFIGS = {
  [RUDEBOYS_CONFIG.projectId]: RUDEBOYS_CONFIG,
  [SPRITES_CONFIG.projectId]: SPRITES_CONFIG,
  [MDTP_CONFIG.projectId]: MDTP_CONFIG,
  [GOBLINTOWN_CONFIG.projectId]: GOBLINTOWN_CONFIG,
  [PEPES_CONFIG.projectId]: PEPES_CONFIG,
};

// eslint-disable-next-line unused-imports/no-unused-vars
export const getTreasureHuntTokenId = (projectId: string): string | null => {
  return null;
};


export const getHost = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].host;
};


export const getChain = (projectId: string): string => {
  return PROJECT_CONFIGS[projectId].chain;
};


export const isCustomizationEnabled = (projectId: string): boolean => {
  return PROJECT_CONFIGS[projectId].isCustomizationEnabled;
};


export const getBackground = (projectId: string): IBackgroundConfig | null => {
  return PROJECT_CONFIGS[projectId].backgroundConfig;
};


export const getBackgroundMusic = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].backgroundMusingFileUrl;
};


export const getLogoImageUrl = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].logoImageUrl;
};


export const getBannerImageUrl = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].bannerImageUrl;
};


export const getIconImageUrl = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].iconImageUrl;
};


export const getEveryviewCode = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].everyviewCode;
};


export const getCollectionAddress = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].collectionAddress;
};


export const isBadgesEnabled = (projectId: string): boolean => {
  return PROJECT_CONFIGS[projectId].isBadgesEnabled;
};

export const getBadges = (projectId: string): IBadge[] => {
  return PROJECT_CONFIGS[projectId].badges;
};

export const getDefaultMembersSort = (projectId: string): string | null => {
  return PROJECT_CONFIGS[projectId].defaultMembersSort;
};
