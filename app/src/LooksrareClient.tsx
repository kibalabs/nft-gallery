import { Requester, RestMethod } from '@kibalabs/core';
import { BigNumber } from 'ethers';

import { CollectionToken, TokenListing } from './client';

export class LooksrareClient {
  private requester: Requester;

  public constructor() {
    this.requester = new Requester(undefined, undefined, false);
  }

  public getTokenListings = async (registryAddress: string, tokenIds: string[]): Promise<Record<string, TokenListing | null>> => {
    const results: Record<string, TokenListing | null> = {};
    await Promise.all(tokenIds.map(async (tokenId: string): Promise<void> => {
      results[tokenId] = await this.getTokenListing(registryAddress, tokenId);
    }));
    return results;
  };

  public getTokenListing = async (registryAddress: string, tokenId: string): Promise<TokenListing | null> => {
    const data: Record<string, unknown> = {
      isOrderAsk: 'true',
      collection: registryAddress,
      tokenId,
      'status[]': 'VALID',
      'pagination[first]': 100,
      sort: 'PRICE_ASC',
    };
    const url = 'https://api.looksrare.org/api/v1/orders';

    const response = await this.requester.makeRequest(RestMethod.GET, url, data);
    const orders = JSON.parse(response.content).data;
    const listings: TokenListing[] = [];
    (orders as Record<string, unknown>[] || []).forEach((order: Record<string, unknown>): void => {
      listings.push(new TokenListing(
        -1,
        new CollectionToken(registryAddress, tokenId, '', null, null, null, null, []),
        order.signer as string,
        new Date(order.startTime as string),
        new Date(order.endTime as string),
        true, // (order["payment_token_contract"] as Record<string, unknown>)["symbol"] === "ETH",
        BigNumber.from((order.price as string).split('.')[0]),
        'looksrare',
        order.hash as string,
      ));
    });
    if (listings.length === 0) {
      return null;
    }
    const sortedListings = listings.sort((listing1: TokenListing, listing2: TokenListing): number => listing2.value.sub(listing1.value).div(1000000000000000000).toNumber());
    return sortedListings[0];
  };
}
