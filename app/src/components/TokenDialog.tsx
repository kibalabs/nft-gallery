import React from 'react';

import { Alignment, Box, Dialog, Direction, EqualGrid, Image, PaddingSize, ResponsiveTextAlignmentView, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';

import { KeyValue } from '../components/KeyValue';
import { Token } from '../model';

interface ITokenDialogProps {
  token: Token;
  isOpen: boolean;
  onCloseClicked: () => void;
}

export const TokenDialog = (props: ITokenDialogProps): React.ReactElement => {
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
            <Image source={props.token.imageUrl} isLazyLoadable={true} />
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
            </Stack>
          </Box>
        </Stack>
      </ResponsiveTextAlignmentView>
    </Dialog>
  );
};
