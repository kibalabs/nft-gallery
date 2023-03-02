import React from 'react';

import { getClassName } from '@kibalabs/core';
import { Alignment, Box, defaultMoleculeProps, Direction, HidingView, Image, InputFrame, KibaIcon, List, Stack, Text } from '@kibalabs/ui-react';
import styled from 'styled-components';

import { Collection } from '../client';

export interface ICollectionViewProps {
  collection: Collection;
}

const CollectionView = (props: ICollectionViewProps): React.ReactElement => {
  return (
    <Stack direction={Direction.Horizontal} shouldAddGutters={true} childAlignment={Alignment.Center}>
      <Image source={props.collection.imageUrl || ''} height='2em' width='2em' alternativeText='' />
      <Stack.Item growthFactor={1} shrinkFactor={1}>
        <Text isSingleLine={true} lineLimit={1}>{props.collection.name}</Text>
      </Stack.Item>
    </Stack>
  );
};

const StyledCollectionSelect = styled.div`
  width: 100%;
  position: relative;
  display: block;
`;

export interface ICollectionSelectProps {
  id?: string;
  className?: string;
  collections: Collection[];
  selectedCollectionAddress: string;
  onCollectionSelected: (collection: Collection) => void;
}

export const CollectionSelect = (props: ICollectionSelectProps): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const selectedCollection = props.collections.find((option: Collection): boolean => option.address === props.selectedCollectionAddress) as Collection;

  const onItemClicked = (itemKey: string) => {
    const clickedCollection = props.collections.find((collection: Collection): boolean => collection.address === itemKey);
    if (!clickedCollection) {
      return;
    }
    props.onCollectionSelected(clickedCollection);
    setIsOpen(false);
  };

  const onToggleOpenClicked = (): void => {
    setIsOpen(!isOpen);
  };

  // const placeholder = props.placeholderText || 'Select an option';

  return (
    <StyledCollectionSelect
      id={props.id}
      className={getClassName(CollectionSelect.displayName, props.className)}
    >
      <InputFrame
        onClicked={onToggleOpenClicked}
        // theme={props.theme?.inputFrameTheme}
        // inputWrapperVariant={props.inputWrapperVariant}
        isEnabled={true}
        // messageText={props.messageText}
      >
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center}>
          <Stack.Item growthFactor={1} shrinkFactor={1}>
            <CollectionView collection={selectedCollection} />
          </Stack.Item>
          <KibaIcon iconId={isOpen ? 'ion-close' : 'ion-chevron-down'} />
        </Stack>
      </InputFrame>
      <HidingView isHidden={!isOpen}>
        <Box variant='card-unpadded-unmargined' isFullWidth={true} zIndex={999} position='absolute'>
          <List onItemClicked={onItemClicked} shouldShowDividers={true} isFullWidth={true}>
            {props.collections.map((option: Collection): React.ReactElement => (
              <List.Item
                key={option.address}
                itemKey={option.address}
                // variant={option.listItemVariant}
                // isDisabled={option.isDisabled}
                isSelected={option.address === props.selectedCollectionAddress}
              >
                <CollectionView collection={option} />
              </List.Item>
            ))}
          </List>
        </Box>
      </HidingView>
    </StyledCollectionSelect>
  );
};

CollectionSelect.displayName = 'CollectionSelect';
CollectionSelect.defaultProps = {
  ...defaultMoleculeProps,

};
