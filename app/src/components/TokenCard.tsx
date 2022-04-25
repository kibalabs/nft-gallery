import React from 'react';

import { Alignment, Box, Direction, Image, LinkBase, Stack, Text } from '@kibalabs/ui-react';

import { Token } from '../model';

interface ITokenCardProps {
  token: Token;
}

export const TokenCard = (props: ITokenCardProps): React.ReactElement => {
  return (
    <LinkBase target={`/tokens/${props.token.tokenId}`} isFullWidth={true}>
      <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center}>
        <Box maxHeight='15em'>
          <Image source={props.token.imageUrl} isLazyLoadable={true} />
        </Box>
        <Text variant='note'>{props.token.name}</Text>
      </Stack>
    </LinkBase>
  );
};
