import { IGlobals } from '../../globalsContext';
import { TokenCollection } from '../../model';
import { loadTokenCollection } from '../../util';

export interface IHomePageData {
  tokenCollection: TokenCollection;
}

export const getHomePageData = async (globals: IGlobals): Promise<IHomePageData> => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const metadatas = __non_webpack_require__(`./assets/${globals.projectId}/metadatas.json`);
  const tokenCollection = loadTokenCollection(metadatas as Record<string, unknown>);
  tokenCollection.tokens = undefined;
  tokenCollection.attributes = undefined;
  return {
    tokenCollection,
  };
};
