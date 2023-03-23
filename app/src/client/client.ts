import { Requester, RestMethod, ServiceClient } from '@kibalabs/core';
import { BigNumber } from 'ethers';

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

  public getCollectionToken = async (registryAddress: string, tokenId: string): Promise<Resources.CollectionToken> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}`;
    const request = new Endpoints.GetCollectionTokenRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetCollectionTokenResponse);
    return response.token;
  };

  public getGalleryToken = async (registryAddress: string, tokenId: string): Promise<Resources.GalleryToken> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${registryAddress}/tokens/${tokenId}`;
    const request = new Endpoints.GetGalleryTokenRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetGalleryTokenResponse);
    return response.galleryToken;
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

  public listCollectionTokenRecentTransfers = async (registryAddress: string, tokenId: string): Promise<Resources.TokenTransfer[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/recent-transfers`;
    const request = new Endpoints.ListTokenRecentTransfersRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListTokenRecentTransfersResponse);
    return response.tokenTransfers;
  };

  public listCollectionTokenOwnerships = async (registryAddress: string, tokenId: string): Promise<Resources.TokenOwnership[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/ownerships`;
    const request = new Endpoints.ListTokenOwnershipsRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListTokenOwnershipsResponse);
    return response.tokenOwnerships;
  };

  public listCollectionTokenAirdrops = async (registryAddress: string, tokenId: string): Promise<Resources.Airdrop[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${registryAddress}/tokens/${tokenId}/airdrops`;
    const request = new Endpoints.ListCollectionTokenAirdropsRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListCollectionTokenAirdropsResponse);
    return response.airdrops;
  };

  public listCollectionTokenListings = async (registryAddress: string, tokenId: string): Promise<Resources.TokenListing[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${registryAddress}/tokens/${tokenId}/listings`;
    const request = new Endpoints.ListCollectionTokenListingsRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListCollectionTokenListingsResponse);
    return response.tokenListings;
  };

  public queryCollectionTokens = async (registryAddress: string, limit?: number, offset?: number, ownerAddress?: string, minPrice?: BigNumber, maxPrice?: BigNumber, isListed?: boolean, tokenIdIn?: string[], attributeFilters?: Endpoints.InQueryParam[], order?: string): Promise<Resources.GalleryToken[]> => {
    const method = RestMethod.POST;
    const path = `gallery/v1/collections/${registryAddress}/tokens/query`;
    const request = new Endpoints.QueryCollectionTokensRequest(limit, offset, ownerAddress, minPrice, maxPrice, isListed, tokenIdIn, attributeFilters, order);
    const response = await this.makeRequest(method, path, request, Endpoints.QueryCollectionTokensResponse);
    return response.galleryTokens;
  };

  public submitTreasureHuntForCollectionToken = async (registryAddress: string, tokenId: string, userAddress: string, signature: string): Promise<void> => {
    const method = RestMethod.POST;
    const path = `gallery/v1/collections/${registryAddress}/tokens/${tokenId}/submit-treasure-hunt`;
    const request = new Endpoints.SubmitTreasureHuntForCollectionTokenRequest(userAddress, signature);
    await this.makeRequest(method, path, request, Endpoints.SubmitTreasureHuntForCollectionTokenResponse);
  };

  public createCustomizationForCollectionToken = async (registryAddress: string, tokenId: string, creatorAddress: string, signature: string, blockNumber: number, name: string | null, description: string | null): Promise<Resources.TokenCustomization> => {
    const method = RestMethod.POST;
    const path = `gallery/v1/collections/${registryAddress}/tokens/${tokenId}/customizations`;
    const request = new Endpoints.CreateCustomizationForCollectionTokenRequest(creatorAddress, signature, blockNumber, name, description);
    const response = await this.makeRequest(method, path, request, Endpoints.CreateCustomizationForCollectionTokenResponse);
    return response.tokenCustomization;
  };

  public getGalleryUser = async (registryAddress: string, userAddress: string): Promise<Resources.GalleryUser> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${registryAddress}/users/${userAddress}`;
    const request = new Endpoints.GetGalleryCollectionUserRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.GetGalleryCollectionUserResponse);
    return response.galleryUser;
  };

  public queryCollectionUsers = async (registryAddress: string, limit?: number, offset?: number, order?: string): Promise<Resources.ListResponse<Resources.GalleryUserRow>> => {
    const method = RestMethod.POST;
    const path = `gallery/v1/collections/${registryAddress}/users/query`;
    const request = new Endpoints.QueryCollectionUsersRequest(limit, offset, order);
    const response = await this.makeRequest(method, path, request, Endpoints.QueryCollectionUsersResponse);
    return response.galleryUserRowListResponse;
  };

  public followGalleryUser = async (registryAddress: string, userAddress: string, account: string, signatureMessage: string, signature: string): Promise<void> => {
    const method = RestMethod.POST;
    const path = `gallery/v1/collections/${registryAddress}/users/${userAddress}/follow`;
    const request = new Endpoints.FollowGalleryUserRequest(account, signatureMessage, signature);
    await this.makeRequest(method, path, request, Endpoints.FollowGalleryUserResponse);
  };

  public listCollectionRecentTransfers = async (address: string, userAddress?: string, limit?: number, offset?: number): Promise<Resources.TokenTransfer[]> => {
    const method = RestMethod.GET;
    const path = `v1/collections/${address}/recent-transfers`;
    const request = new Endpoints.GetCollectionRecentTransfersRequest(userAddress, limit, offset);
    const response = await this.makeRequest(method, path, request, Endpoints.GetCollectionRecentTransfersResponse);
    return response.tokenTransfers;
  };

  public listUserOwnedCollections = async (address: string, userAddress: string): Promise<Resources.GalleryOwnedCollection[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${address}/users/${userAddress}/owned-collections`;
    const request = new Endpoints.ListGalleryUserOwnedCollectionsRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListGalleryUserOwnedCollectionsResponse);
    return response.ownedCollections;
  };

  public listUserBadges = async (address: string, userAddress: string): Promise<Resources.GalleryUserBadge[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${address}/users/${userAddress}/badges`;
    const request = new Endpoints.ListGalleryUserBadgesRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListGalleryUserBadgesResponse);
    return response.galleryUserBadges;
  };

  public listCollectionOverlapSummaries = async (address: string): Promise<Resources.CollectionOverlapSummary[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${address}/overlap-summaries`;
    const request = new Endpoints.ListGalleryCollectionOverlapSummariesRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListGalleryCollectionOverlapSummariesResponse);
    return response.collectionOverlapSummaries;
  };

  public listCollectionOverlaps = async (address: string, otherRegistryAddress?: string): Promise<Resources.CollectionOverlap[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/collections/${address}/overlaps`;
    const request = new Endpoints.ListGalleryCollectionOverlapsRequest(otherRegistryAddress);
    const response = await this.makeRequest(method, path, request, Endpoints.ListGalleryCollectionOverlapsResponse);
    return response.collectionOverlaps;
  };

  public listEntriesInSuperCollection = async (superCollectionName: string): Promise<Resources.SuperCollectionEntry[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/super-collections/${superCollectionName}/entries`;
    const request = new Endpoints.ListEntriesInSuperCollectionRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListEntriesInSuperCollectionResponse);
    return response.superCollectionEntries;
  };

  public listSuperCollectionOverlapSummaries = async (superCollectionName: string): Promise<Resources.CollectionOverlapSummary[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/super-collections/${superCollectionName}/overlap-summaries`;
    const request = new Endpoints.ListGallerySuperCollectionOverlapSummariesRequest();
    const response = await this.makeRequest(method, path, request, Endpoints.ListGallerySuperCollectionOverlapSummariesResponse);
    return response.collectionOverlapSummaries;
  };

  public listSuperCollectionOverlaps = async (superCollectionName: string, otherRegistryAddress?: string): Promise<Resources.SuperCollectionOverlap[]> => {
    const method = RestMethod.GET;
    const path = `gallery/v1/super-collections/${superCollectionName}/overlaps`;
    const request = new Endpoints.ListGallerySuperCollectionOverlapsRequest(otherRegistryAddress);
    const response = await this.makeRequest(method, path, request, Endpoints.ListGallerySuperCollectionOverlapsResponse);
    return response.superCollectionOverlaps;
  };

  public querySuperCollectionUsers = async (superCollectionName: string, limit?: number, offset?: number, order?: string): Promise<Resources.ListResponse<Resources.GallerySuperCollectionUserRow>> => {
    const method = RestMethod.POST;
    const path = `gallery/v1/super-collections/${superCollectionName}/users/query`;
    const request = new Endpoints.QuerySuperCollectionUsersRequest(limit, offset, order);
    const response = await this.makeRequest(method, path, request, Endpoints.QuerySuperCollectionUsersResponse);
    return response.galleryUserRowListResponse;
  };
}
