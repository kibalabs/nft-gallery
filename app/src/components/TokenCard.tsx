import React from 'react';

import { etherToNumber, longFormatNumber } from '@kibalabs/core';
import { Alignment, Box, Direction, Image, LinkBase, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { TokenListing } from '../client';
import { Token } from '../model';
import { EtherValue } from './EtherValue';

interface ITokenCardProps {
  target: string;
  token: Token;
  tokenListing?: TokenListing | null;
}

export const TokenCard = (props: ITokenCardProps): React.ReactElement => {
  const imageUrl = props.token.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/');
  return (
    <LinkBase target={props.target} isFullWidth={true}>
      <Box variant='tokenCard' shouldClipContent={true}>
        <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Start} paddingBottom={PaddingSize.Default}>
          <Box maxHeight='20em' minHeight='10em' shouldClipContent={true} variant='unrounded'>
            <Image source={imageUrl} variant='unrounded' fitType='contain' isLazyLoadable={true} isCenteredHorizontally={true} isFullHeight={true} isFullWidth={true} alternativeText={props.token.name} />
          </Box>
          <Stack direction={Direction.Horizontal} paddingHorizontal={PaddingSize.Wide} isFullWidth={true} childAlignment={Alignment.Center}>
            <Text variant='tokenCardName'>{props.token.name}</Text>
            <Stack.Item growthFactor={1} shrinkFactor={1} />
            {props.tokenListing && (
              <EtherValue textVariant='tokenCardValue' value={longFormatNumber(etherToNumber(props.tokenListing.value))} />
            )}
          </Stack>
        </Stack>
      </Box>
    </LinkBase>
  );
};
