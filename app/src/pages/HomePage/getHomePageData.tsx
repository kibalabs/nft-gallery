import { Collection, CollectionAttribute, CollectionToken } from '../../client';
import { IGlobals } from '../../globalsContext';
import { IGalleryPageData } from '../../PageDataContext';
import { getCollectionAddress } from '../../util';

export interface IHomePageData extends IGalleryPageData {
}

export const getHomePageData = async (globals: IGlobals): Promise<IHomePageData> => {
  const collectionAddress = getCollectionAddress(globals.projectId);
  if (collectionAddress) {
    const collection = await globals.notdClient.getCollection(collectionAddress);
    const collectionAttributes = await globals.notdClient.listCollectionAttributes(collectionAddress);
    return {
      collection,
      allTokens: undefined,
      collectionAttributes,
    };
  }
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const data = __non_webpack_require__(`./assets/${globals.projectId}/data.json`);
  const collection = Collection.fromObject(data.collection);
  const allTokens = data.collectionTokens.map((record: Record<string, unknown>): CollectionToken => CollectionToken.fromObject(record));
  const collectionAttributes = data.collectionAttributes.map((record: Record<string, unknown>): CollectionAttribute => CollectionAttribute.fromObject(record));
  return {
    collection,
    allTokens,
    collectionAttributes,
  };
};
