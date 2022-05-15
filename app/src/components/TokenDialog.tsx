import React from 'react';

import { truncateMiddle } from '@kibalabs/core';
import { Alignment, Box, Dialog, Direction, EqualGrid, Image, LinkBase, PaddingSize, ResponsiveTextAlignmentView, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { KeyValue } from '../components/KeyValue';
import { Token } from '../model';

interface ITokenDialogProps {
  token: Token;
  isOpen: boolean;
  onCloseClicked: () => void;
}

export const TokenDialog = (props: ITokenDialogProps): React.ReactElement => {
  const imageUrl = props.token.imageUrl.startsWith('ipfs://') ? props.token.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/') : props.token.imageUrl;
  const frameImageUrl = props.token.frameImageUrl.startsWith('ipfs://') ? props.token.frameImageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/') : props.token.frameImageUrl;

  return (
    <Dialog
      isOpen={props.isOpen}
      onCloseClicked={props.onCloseClicked}
      maxWidth='1000px'
      maxHeight='90%'
    >
      <ResponsiveTextAlignmentView alignmentResponsive={{ base: TextAlignment.Center, medium: TextAlignment.Left }}>
        <Stack directionResponsive={{ base: Direction.Vertical, medium: Direction.Horizontal }} isFullWidth={true} isFullHeight={true} childAlignment={Alignment.Center}>
          <Box maxHeight='30em' width='50%'>
            <Image source={imageUrl} isLazyLoadable={true} alternativeText={props.token.name} />
          </Box>
          <Spacing variant={PaddingSize.Wide2} />
          <Box width='50%'>
            <Stack direction={Direction.Vertical}>
              <Text variant='header2'>{props.token.name}</Text>
              <Spacing variant={PaddingSize.Wide} />
              <EqualGrid childSize={6} contentAlignment={Alignment.Start} shouldAddGutters={true} defaultGutter={PaddingSize.Wide}>
                {Object.keys(props.token.attributeMap).map((attributeKey: string): React.ReactElement => (
                  <KeyValue key={attributeKey} name={attributeKey} nameTextVariant='note' value={props.token.attributeMap[attributeKey]} valueTextVariant='bold' />
                ))}
              </EqualGrid>
              <React.Fragment>
                <Text variant='note'>Frame Image Url</Text>
                <LinkBase target={frameImageUrl}>
                  <Text>{truncateMiddle(props.token.frameImageUrl, 25)}</Text>
                </LinkBase>
              </React.Fragment>
            </Stack>
          </Box>
        </Stack>
      </ResponsiveTextAlignmentView>
    </Dialog>
  );
};
