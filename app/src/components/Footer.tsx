import React from 'react';

import { Alignment, Box, Direction, Image, LinkBase, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

export const Footer = (): React.ReactElement => {
  return (
    <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center}>
      <LinkBase target='https://www.tokenpage.xyz?ref=gallery'>
        <Box variant='card-unpadded'>
          <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
            <Text variant='note'>Made by</Text>
            <Box shouldClipContent={true} width='1rem' height='1rem'>
              <Image source='https://www.tokenpage.xyz/assets/favicon.png' alternativeText='TokenPage Logo' fitType='contain' />
            </Box>
            <Text variant='note'>Token Page</Text>
          </Stack>
        </Box>
      </LinkBase>
    </Stack>
  );
};
