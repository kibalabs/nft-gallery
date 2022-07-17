import { Requester, RestMethod, ServiceClient } from '@kibalabs/core';

import * as Endpoints from './endpoints';
import * as Resources from './resources';

export class NotdClient extends ServiceClient {
  public constructor(requester: Requester, baseUrl?: string) {
    super(requester, baseUrl || 'https://notd-api.kibalabs.com');
  }

  public getCollection = async (registryAddress: string): Promise<Resources.Collection> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}`;
    const request = new Endpoints.GetCollectionRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetCollectionResponse);
    return response.collection;
  };

  public listCollectionAttributes = async (address: string): Promise<Resources.CollectionAttribute[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${address}/attributes`;
    const request = new Endpoints.ListCollectionAttributesRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListCollectionAttributesResponse);
    return response.attributes;
  };

  public listCollectionTokensByOwner = async (address: string, ownerAddress: string): Promise<Resources.CollectionToken[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${address}/tokens/owner/${ownerAddress}`;
    const request = new Endpoints.ListCollectionTokensByOwnersRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListCollectionTokensByOwnersResponse);
    return response.tokens;
  };

  public submitTreasureHuntForCollectionToken = async (registryAddress: string, tokenId: string, userAddress: string, signature: string): Promise<void> => {
    const method = RestMethod.POST;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/submit-treasure-hunt`;
    const request = new Endpoints.SubmitTreasureHuntForCollectionTokenRequest(userAddress, signature);
    await this.makeRequest(method, path, request, Endpoints.SubmitTreasureHuntForCollectionTokenResponse);
  };

  public listCollectionTokenRecentTransfers = async (registryAddress: string, tokenId: string): Promise<Resources.TokenTransfer[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/recent-transfers`;
    const request = new Endpoints.ListTokenRecentTransfersRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListTokenRecentTransfersResponse);
    return response.tokenTransfers;
  };

  public listCollectionTokenAirdrops = async (registryAddress: string, tokenId: string): Promise<Resources.Airdrop[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${registryAddress}/tokens/${tokenId}/airdrops`;
    const request = new Endpoints.ListCollectionTokenAirdropsRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListCollectionTokenAirdropsResponse);
    return response.airdrops;
  };

  public queryCollectionTokens = async (registryAddress: string, limit?: number, offset?: number, minPrice?: number, maxPrice?: number, isListed?: boolean, tokenIdIn?: string[], attributeFilters?: Endpoints.InQueryParam[]): Promise<Resources.CollectionToken[]> => {
    const method = RestMethod.POST;
    const path = `gallery/v1/collections/${registryAddress}/tokens/query`;
    const request = new Endpoints.QueryCollectionTokensRequest(limit, offset, minPrice, maxPrice, isListed, tokenIdIn, attributeFilters);
    const response = await this.makeRequest(method, path, request, Endpoints.QueryCollectionTokensResponse);
    return response.tokens;
  };
}
