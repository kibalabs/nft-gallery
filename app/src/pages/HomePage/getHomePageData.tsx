import { Collection, CollectionAttribute, CollectionToken } from '../../client';
import { IGlobals } from '../../globalsContext';
import { TokenCollection } from '../../model';
import { getCollectionAddress, loadTokenCollection } from '../../util';

export interface IHomePageData {
  collection: Collection;
  collectionTokens: CollectionToken[];
  collectionAttributes: CollectionAttribute[];
}

export const getHomePageData = async (globals: IGlobals): Promise<IHomePageData> => {
  const collectionAddress = getCollectionAddress(globals.projectId);
  if (collectionAddress) {
      const collection = await globals.notdClient.getCollection(collectionAddress);
      const collectionTokens = await globals.notdClient.queryCollectionTokens(collectionAddress);
      const collectionAttributes = await globals.notdClient.listCollectionAttributes(collectionAddress);
      return {
        collection,
        collectionTokens,
        collectionAttributes,
      };
    } else {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    // const metadatas = __non_webpack_require__(`./assets/${globals.projectId}/metadatas.json`);
    // const tokenCollection = loadTokenCollection(metadatas as Record<string, unknown>);
    // tokenCollection.tokens = undefined;
    // tokenCollection.attributes = undefined;
    return {
      collection: null,
      collectionTokens: [],
      collectionAttributes: [],
    }
  }
};
