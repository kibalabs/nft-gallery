import { Requester, RestMethod } from '@kibalabs/core';
import { BigNumber } from 'ethers';

import { CollectionToken, TokenListing } from './client';
import { getChunks } from './listUtil';

export class OpenseaClient {
  private requester: Requester;

  public constructor() {
    this.requester = new Requester(undefined, undefined, false);
  }

  public getTokenListings = async (registryAddress: string, tokenIds: string[]): Promise<Record<string, TokenListing | null>> => {
    const tokenIdChunks = getChunks(tokenIds, 30);
    const tokenListings: Record<string, TokenListing | null> = {};
    for (let tokenIdChunksIndex = 0; tokenIdChunksIndex < tokenIdChunks.length; tokenIdChunksIndex += 1) {
      const innerTokenIds = tokenIdChunks[tokenIdChunksIndex];
      const data: Record<string, unknown> = {
        token_ids: innerTokenIds,
        asset_contract_address: registryAddress,
        include_orders: true,
        limit: innerTokenIds.length,
      };
      const url = 'https://api.opensea.io/api/v1/assets';
      // eslint-disable-next-line no-await-in-loop
      const response = await this.requester.makeRequest(RestMethod.GET, url, data);
      const assets = JSON.parse(response.content).assets;
      assets.forEach((asset: Record<string, unknown>): void => {
        const tokenId = asset.token_id as string;
        const listings: TokenListing[] = [];
        (asset.sell_orders as Record<string, unknown>[] || []).forEach((sellOrder: Record<string, unknown>): void => {
          if (sellOrder.side !== 1 || sellOrder.sale_kind !== 0 || sellOrder.cancelled) {
            return;
          }
          listings.push(new TokenListing(
            -1,
            new CollectionToken(registryAddress, tokenId, '', null, null, null, null, []),
            (sellOrder.maker as Record<string, unknown>).address as string,
            new Date(sellOrder.listing_time as string),
            new Date(sellOrder.expiration_time as string),
            (sellOrder.payment_token_contract as Record<string, unknown>).symbol === 'ETH',
            BigNumber.from((sellOrder.current_price as string).split('.')[0]),
            'opensea-wyvern',
            sellOrder.order_hash as string,
          ));
        });
        (asset.seaport_sell_orders as Record<string, unknown>[] || []).forEach((seaportSellOrder: Record<string, unknown>): void => {
          if (seaportSellOrder.side !== 'ask' || seaportSellOrder.order_type !== 'basic' || seaportSellOrder.cancelled) {
            return;
          }
          listings.push(new TokenListing(
            -1,
            new CollectionToken(registryAddress, tokenId, '', null, null, null, null, []),
            (seaportSellOrder.maker as Record<string, unknown>).address as string,
            new Date(seaportSellOrder.listing_time as string),
            new Date(seaportSellOrder.expiration_time as string),
            true, // (seaportSellOrder["payment_token_contract"] as Record<string, unknown>)["symbol"] === "ETH",
            BigNumber.from((seaportSellOrder.current_price as string).split('.')[0]),
            'opensea-wyvern',
            seaportSellOrder.order_hash as string,
          ));
        });
        if (listings.length === 0) {
          tokenListings[tokenId] = null;
        } else {
          const sortedListings = listings.sort((listing1: TokenListing, listing2: TokenListing): number => listing2.value.sub(listing1.value).div(1000000000000000000).toNumber());
          tokenListings[tokenId] = sortedListings[0];
        }
      });
      innerTokenIds.forEach((tokenId: string): void => {
        if (!tokenListings[tokenId]) {
          tokenListings[tokenId] = null;
        }
      });
    }
    return tokenListings;
  };

  public getTokenListing = async (registryAddress: string, tokenId: string): Promise<TokenListing | null> => {
    const listings = await this.getTokenListings(registryAddress, [tokenId]);
    return listings[tokenId];
  };
}
