import { Requester, RestMethod, ServiceClient } from '@kibalabs/core';

import * as Endpoints from './endpoints';
import * as Resources from './resources';

export class NotdClient extends ServiceClient {
  public constructor(requester: Requester, baseUrl?: string) {
    super(requester, baseUrl || 'https://notd-api.kibalabs.com');
  }

  public getTokenRecentTransfers = async (registryAddress: string, tokenId: string): Promise<Resources.TokenTransfer[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/recent-transfers`;
    const request = new Endpoints.GetTokenRecentTransfersRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetTokenRecentTransfersResponse);
    return response.tokenTransfers;
  };

  // @router.post('/collections/{registryAddress}/tokens/{tokenId}/submit-treasure-hunt')
  // async def submit_treasure_hunt_for_collection_token(registryAddress: str, tokenId: str, request: SubmitTreasureHuntForCollectionTokenRequest):
  //     await notdManager.submit_treasure_hunt_for_collection_token(registryAddress=registryAddress, tokenId=tokenId, userAddress=request.userAddress, signature=request.signature)
  //     return SubmitTreasureHuntForCollectionTokenResponse()

  public submitTreasureHuntForCollectionToken = async (registryAddress: string, tokenId: string, userAddress: string, signature: string): Promise<void> => {
    const method = RestMethod.POST;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/submit-treasure-hunt`;
    const request = new Endpoints.SubmitTreasureHuntForCollectionTokenRequest(userAddress, signature);
    await this.makeRequest(method, path, request, Endpoints.SubmitTreasureHuntForCollectionTokenResponse);
  };
}
