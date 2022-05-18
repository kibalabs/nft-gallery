import React from 'react';

import { truncateMiddle } from '@kibalabs/core';
import { Alignment, Box, Dialog, Direction, EqualGrid, Image, Link, PaddingSize, ResponsiveTextAlignmentView, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { KeyValue } from '../components/KeyValue';
import { Token } from '../model';

interface ITokenDialogProps {
  token: Token;
  isOpen: boolean;
  onCloseClicked: () => void;
}

export const TokenDialog = (props: ITokenDialogProps): React.ReactElement => {
  const imageUrl = props.token.imageUrl.startsWith('ipfs://') ? props.token.imageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/') : props.token.imageUrl;
  const frameImageUrl = props.token.frameImageUrl && props.token.frameImageUrl.startsWith('ipfs://') ? props.token.frameImageUrl.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/') : props.token.frameImageUrl;

  return (
    <Dialog
      isOpen={props.isOpen}
      onCloseClicked={props.onCloseClicked}
      maxWidth='1000px'
      maxHeight='90%'
    >
      <ResponsiveTextAlignmentView alignmentResponsive={{ base: TextAlignment.Center, medium: TextAlignment.Left }}>
        <Stack directionResponsive={{ base: Direction.Vertical, medium: Direction.Horizontal }} isFullWidth={true} isFullHeight={true} childAlignment={Alignment.Center}>
          <Stack.Item growthFactor={1} shrinkFactor={1}>
            <Box maxHeight='30em' maxWidth='50%' isFullWidth={false}>
              <Image source={imageUrl} isLazyLoadable={true} alternativeText={props.token.name} />
            </Box>
          </Stack.Item>
          <Spacing variant={PaddingSize.Wide2} />
          <Stack.Item growthFactor={1} shrinkFactor={1}>
            <Stack direction={Direction.Vertical} contentAlignment={Alignment.Start} isFullHeight={true}>
              <Text variant='header2'>{props.token.name}</Text>
              <Spacing variant={PaddingSize.Wide} />
              <EqualGrid childSize={6} contentAlignment={Alignment.Start} shouldAddGutters={true} defaultGutter={PaddingSize.Wide}>
                {Object.keys(props.token.attributeMap).map((attributeKey: string): React.ReactElement => (
                  <KeyValue key={attributeKey} name={attributeKey} nameTextVariant='note' value={props.token.attributeMap[attributeKey]} valueTextVariant='bold' />
                ))}
              </EqualGrid>
              { frameImageUrl && (
                <Stack direction={Direction.Vertical} childAlignment={Alignment.Start} contentAlignment={Alignment.Start} shouldAddGutters={true} paddingLeft={PaddingSize.Wide}>
                  <Text variant='note'>Frame</Text>
                  <Stack direction={Direction.Horizontal} childAlignment={Alignment.Start} contentAlignment={Alignment.Start} shouldAddGutters={true}>
                    <Box variant='rounded' shouldClipContent={true} height='20px' width='20px'>
                      <Image source={`${frameImageUrl}`} alternativeText='Avatar' />
                    </Box>
                    <Link text={truncateMiddle(props.token.frameImageUrl, 30)} target={frameImageUrl} />
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Stack.Item>
        </Stack>
      </ResponsiveTextAlignmentView>
    </Dialog>
  );
};
