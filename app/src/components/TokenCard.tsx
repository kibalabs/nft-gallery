import React from 'react';

import { Alignment, Box, Direction, Image, LinkBase, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { Token } from '../model';

interface ITokenCardProps {
  target: string;
  token: Token;
}

export const TokenCard = (props: ITokenCardProps): React.ReactElement => {
  const imageUrl = props.token.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/');
  return (
    <LinkBase target={props.target} isFullWidth={true}>
      <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center} paddingBottom={PaddingSize.Default}>
        <Box maxHeight='20em' minHeight='5em' shouldClipContent={true}>
          <Image source={imageUrl} fitType='contain' isLazyLoadable={true} isCenteredHorizontally={true} isFullHeight={true} isFullWidth={true} alternativeText={props.token.name} />
        </Box>
        <Text variant='note-tokenCardName'>{props.token.name}</Text>
      </Stack>
    </LinkBase>
  );
};
