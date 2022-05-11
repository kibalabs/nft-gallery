import React from 'react';

import { Alignment, Direction, Image, LinkBase, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { Token } from '../model';

interface ITokenCardProps {
  token: Token;
}

export const TokenCard = (props: ITokenCardProps): React.ReactElement => {
  const imageUrl = props.token.imageUrl.startsWith('ipfs://') ? props.token.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/') : props.token.imageUrl;
  return (
    <LinkBase target={`/tokens/${props.token.tokenId}`} isFullWidth={true}>
      <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center} paddingBottom={PaddingSize.Default}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '10em', maxHeight: '15em', width: '100%', overflow: 'hidden' }}>
          <Image source={imageUrl} isLazyLoadable={true} isCenteredHorizontally={true} isFullHeight={true} alternativeText={props.token.name} />
        </div>
        <Text variant='note'>{props.token.name}</Text>
      </Stack>
    </LinkBase>
  );
};
