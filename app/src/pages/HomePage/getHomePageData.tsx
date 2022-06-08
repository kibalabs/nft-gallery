import path from 'path';
import { RestMethod } from '@kibalabs/core';

import { IGlobals } from '../../globalsContext';
import { TokenCollection } from '../../model';
import { loadTokenCollection } from '../../util';

export interface IHomePageData {
  tokenCollection: TokenCollection;
}

export const getHomePageData = async (globals: IGlobals): Promise<IHomePageData> => {
  console.log('here');
  console.log(__dirname);
  console.log(path.join('./assets', globals.projectId, 'metadatas.json'));
  require(path.join('./assets', globals.projectId, 'metadatas.json'))
  // const metadataResponse = await globals.requester.makeRequest(RestMethod.GET, `${window.location.origin}/assets/${globals.projectId}/metadatas.json`);
  // const tokenCollection = loadTokenCollection(JSON.parse(metadataResponse.content) as Record<string, unknown>);
  // return {
  //   tokenCollection: tokenCollection || null,
  // };
  throw new Error('dont worry')
};
