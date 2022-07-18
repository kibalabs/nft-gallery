import { Collection, CollectionAttribute, CollectionToken } from '../../client';
import { IGlobals } from '../../globalsContext';
import { IGalleryPageData } from '../../PageDataContext';
import { getCollectionAddress } from '../../util';

export interface IHomePageData extends IGalleryPageData {
  collection: Collection;
  allTokens: CollectionToken[] | undefined;
  collectionTokens: CollectionToken[];
  collectionAttributes: CollectionAttribute[];
}

export const getHomePageData = async (globals: IGlobals): Promise<IHomePageData> => {
  const collectionAddress = getCollectionAddress(globals.projectId);
  if (collectionAddress) {
    const collection = await globals.notdClient.getCollection(collectionAddress);
    // const collectionTokens = await globals.notdClient.queryCollectionTokens(collectionAddress);
    const collectionAttributes = await globals.notdClient.listCollectionAttributes(collectionAddress);
    return {
      collection,
      allTokens: undefined,
      collectionTokens: [],
      collectionAttributes,
    };
  }
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const dataString = __non_webpack_require__(`./assets/${globals.projectId}/data.json`);
  const data = JSON.parse(dataString);
  const collection = Collection.fromObject(data.collection);
  const allTokens = data.collectionTokens.map((record: Record<string, unknown>): CollectionToken => CollectionToken.fromObject(record));
  const collectionAttributes = data.collectionAttributes.map((record: Record<string, unknown>): CollectionAttribute => CollectionAttribute.fromObject(record));
  return {
    collection,
    allTokens: allTokens,
    collectionTokens: [],
    collectionAttributes,
  };
};
