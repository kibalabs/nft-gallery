import React from 'react';

import { Alignment, Box, Direction, Image, LinkBase, PaddingSize, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { CollectionToken } from '../client';

interface ITokenSalesCardProps {
  target: string;
  tokenCollection: CollectionToken;
  subtitle?: string
}

export const TokenSalesCard = (props: ITokenSalesCardProps): React.ReactElement => {
  const imageUrl = props.tokenCollection.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/');
  return (
    <LinkBase target={props.target} isFullWidth={true}>
      <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center} paddingBottom={PaddingSize.Default}>
        <Box maxHeight='20em' minHeight='5em' shouldClipContent={true}>
          <Image source={imageUrl} fitType='contain' isLazyLoadable={true} isCenteredHorizontally={true} isFullHeight={true} isFullWidth={true} alternativeText={props.tokenCollection.name} />
        </Box>
        <Text variant='note-tokenCardName'>{props.tokenCollection.name}</Text>
        <Text variant='small' lineLimit={2} alignment={TextAlignment.Center}>{props.subtitle}</Text>
      </Stack>
    </LinkBase>
  );
};
