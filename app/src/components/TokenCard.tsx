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
}

export const TokenCard = (props: ITokenCardProps): React.ReactElement => {
  const imageUrl = props.token.resizableImageUrl ?? props.token.imageUrl?.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/');
  return (
    <LinkBase target={props.target} isFullWidth={true}>
      <Box variant='tokenCard' shouldClipContent={true}>
        <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Start} paddingBottom={PaddingSize.Default}>
          <Box maxHeight='20em' minHeight='7em' shouldClipContent={true} variant='unrounded'>
            <Image source={imageUrl || ''} variant='unrounded' fitType='contain' isLazyLoadable={true} isCenteredHorizontally={true} isFullHeight={true} isFullWidth={true} alternativeText={props.token.name} />
          </Box>
          <Stack direction={Direction.Horizontal} paddingHorizontal={PaddingSize.Wide} isFullWidth={true} childAlignment={Alignment.Center} shouldWrapItems={true}>
            <Text variant='tokenCardName'>{props.tokenCustomization?.name || props.token.name}</Text>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Spacing variant={PaddingSize.Wide} />
            </Stack.Item>
            <HidingView isInvisible={!props.tokenListing}>
              <EtherValue textVariant='tokenCardValue' value={props.tokenListing?.value ? longFormatNumber(etherToNumber(props.tokenListing.value)) : '------'} />
            </HidingView>
          </Stack>
        </Stack>
      </Box>
    </LinkBase>
  );
};
