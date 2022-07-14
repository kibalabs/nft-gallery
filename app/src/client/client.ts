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

  public getCollectionHoldings = async (address: string, ownerAddress: string): Promise<Resources.CollectionToken[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${address}/tokens/owner/${ownerAddress}`;
    const request = new Endpoints.GetCollectionHoldingsRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetCollectionHoldingsResponse);
    return response.tokens;
  };

  public submitTreasureHuntForCollectionToken = async (registryAddress: string, tokenId: string, userAddress: string, signature: string): Promise<void> => {
    const method = RestMethod.POST;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/submit-treasure-hunt`;
    const request = new Endpoints.SubmitTreasureHuntForCollectionTokenRequest(userAddress, signature);
    await this.makeRequest(method, path, request, Endpoints.SubmitTreasureHuntForCollectionTokenResponse);
  };

  public listCollectionTokenAirdrops = async (registryAddress: string, tokenId: string): Promise<Resources.Airdrop[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${registryAddress}/tokens/${tokenId}/airdrops`;
    const request = new Endpoints.ListCollectionTokenAirdropsRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListCollectionTokenAirdropsResponse);
    return response.airdrops;
  };

  public getCollectionRecentSales = async (address: string): Promise<Resources.TokenTransfer[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${address}/recent-sales`;
    const request = new Endpoints.GetCollectionRecentSalesRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetCollectionRecentSalesResponse);
    return response.tokenTransfers;
  };
}
