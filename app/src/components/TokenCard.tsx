import React from 'react';

import { etherToNumber, longFormatNumber, updateQueryString } from '@kibalabs/core';
import { Alignment, Box, Direction, HidingView, LinkBase, PaddingSize, PaddingView, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { EtherValue } from './EtherValue';
import { IpfsImage } from './IpfsImage';
import { CollectionToken, TokenCustomization, TokenListing } from '../client';

interface ITokenCardProps {
  target: string;
  token: CollectionToken;
  tokenCustomization?: TokenCustomization | null;
  tokenListing?: TokenListing | null;
  tokenQuantity: number;
  shouldUsePreviewImages?: boolean;
}

export const TokenCard = (props: ITokenCardProps): React.ReactElement => {
  let imageUrl = props.token.resizableImageUrl ?? props.token.imageUrl ?? '';
  const isImageResponsive = imageUrl.includes('d35ci2i0uce4j6.cloudfront.net') || imageUrl.includes('pablo-images.kibalabs.com');
  if (isImageResponsive && props.shouldUsePreviewImages) {
    imageUrl = updateQueryString(imageUrl, { p: true });
  }

  return (
    <LinkBase target={props.target} isFullWidth={true}>
      <Box variant='tokenCard' shouldClipContent={true} isFullHeight={true}>
        <Stack direction={Direction.Vertical} shouldAddGutters={true} contentAlignment={Alignment.Start} paddingBottom={PaddingSize.Default} isFullHeight={true}>
          <Box maxHeight={'20em'} minHeight={'7em'} shouldClipContent={true} variant='unrounded'>
            <IpfsImage source={imageUrl} variant='unrounded' fitType='contain' isLazyLoadable={true} isCenteredHorizontally={true} isFullHeight={true} isFullWidth={true} alternativeText={props.token.name} />
            {props.tokenQuantity > 1 && (
              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <Box variant='tokenCardQuantity' shouldClipContent={true}>
                  <PaddingView paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Narrow}>
                    <Text variant='note'>{`x${props.tokenQuantity}`}</Text>
                  </PaddingView>
                </Box>
              </div>
            )}
          </Box>
          <Stack direction={Direction.Horizontal} paddingHorizontal={PaddingSize.Wide} isFullWidth={true} childAlignment={Alignment.Center}>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Text variant='tokenCardName' shouldBreakOnWords={true}>{props.tokenCustomization?.name || props.token.name}</Text>
            </Stack.Item>
            <HidingView isHidden={!props.tokenListing || !props.tokenListing?.value}>
              <Spacing variant={PaddingSize.Default} />
              <EtherValue textVariant='tokenCardValue' value={props.tokenListing ? longFormatNumber(etherToNumber(props.tokenListing.value)) : ''} />
            </HidingView>
          </Stack>
        </Stack>
      </Box>
    </LinkBase>
  );
};
