import React from 'react';

import { etherToNumber, longFormatNumber } from '@kibalabs/core';
import { Alignment, Box, Direction, HidingView, Image, LinkBase, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { CollectionToken, TokenCustomization, TokenListing } from '../client';
import { EtherValue } from './EtherValue';

interface ITokenCardProps {
  target: string;
  token: CollectionToken;
  tokenCustomization?: TokenCustomization | null;
  tokenListing?: TokenListing | null;
  tokenQuantity: number;
}

export const TokenCard = (props: ITokenCardProps): React.ReactElement => {
  const imageUrl = props.token.resizableImageUrl ?? props.token.imageUrl?.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/');
  return (
    <LinkBase target={props.target} isFullWidth={true}>
      <Box variant='tokenCard' shouldClipContent={true} isFullHeight={true}>
        <Stack direction={Direction.Vertical} shouldAddGutters={true} contentAlignment={Alignment.Start} paddingBottom={PaddingSize.Default} isFullHeight={true}>
          <Box maxHeight={'20em'} minHeight={'15em'} shouldClipContent={true} variant='unrounded'>
            <Image source={imageUrl || ''} variant='unrounded' fitType='contain' isLazyLoadable={true} isCenteredHorizontally={true} isFullHeight={true} isFullWidth={true} alternativeText={props.token.name} />
            {/* <LayerContainer>
              <LayerContainer.Layer alignmentVertical={Alignment.Start} alignmentHorizontal={Alignment.End} isFullWidth={false} isFullHeight={false}>
                <Text variant='note'>{`x${props.tokenQuantity}`}</Text>
              </LayerContainer.Layer>
            </LayerContainer> */}
          </Box>
          <Stack direction={Direction.Horizontal} paddingHorizontal={PaddingSize.Wide} isFullWidth={true} childAlignment={Alignment.Center}>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Text variant='tokenCardName' shouldBreakOnWords={true}>{props.tokenCustomization?.name || props.token.name}</Text>
            </Stack.Item>
            <HidingView isHidden={!props.tokenListing || !props.tokenListing?.value}>
              <Spacing />
              <EtherValue textVariant='tokenCardValue' value={props.tokenListing ? longFormatNumber(etherToNumber(props.tokenListing.value)) : ''} />
            </HidingView>
          </Stack>
        </Stack>
      </Box>
    </LinkBase>
  );
};
