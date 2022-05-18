import { Requester, RestMethod, ServiceClient } from '@kibalabs/core';

import * as Endpoints from './endpoints';
import * as Resources from './resources';

export class NotdClient extends ServiceClient {
  public constructor(requester: Requester, baseUrl?: string) {
    super(requester, baseUrl || 'https://notd-api.kibalabs.com');
  }
  public getTokenRecentTransfers = async (registryAddress: string, tokenId: number): Promise<Resources.TokenTransfer[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}/token/${tokenId}/recent-transfers`;
    const request = new Endpoints.GetTokenRecentTransfersRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetTokenRecentTransfersResponse);
    return response.tokenTransfers;
  };
}
