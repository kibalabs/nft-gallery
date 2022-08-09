import React from 'react';

import { Alignment, Checkbox, Direction, IOption, OptionSelect, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { Account } from '../AccountContext';
import { Collection, CollectionAttribute } from '../client';


export interface IFilterProps {
  account: Account | null | undefined;
  collection: Collection;
  collectionAttributes: CollectionAttribute[];
  filters: Record<string, string>;
  onAttributeValueClicked: (attributeName: string, attributeValue: string | null | undefined) => void;
  showOwnedTokensOnly: boolean;
  setShowOwnedTokensOnly: (newShowOwnedTokensOnly: boolean) => void;
  showListedTokensOnly: boolean;
  setShowListedTokensOnly: (newShowListedTokensOnly: boolean) => void;
  shouldShowMusicOption: boolean;
  shouldPlayMusic: boolean;
  setShouldPlayMusic: (newShouldPlayMusic: boolean) => void;
}

export const Filter = (props: IFilterProps): React.ReactElement => {
  const getOptions = (attribute: CollectionAttribute): IOption[] => {
    return attribute.values.map((value: string): IOption => ({
      text: value,
      itemKey: value,
    }));
  };

  const getSelectedOptionKey = (attribute: CollectionAttribute): string | undefined => {
    return props.filters[attribute.name];
  };

  const onShowOwnedTokensOnlyToggled = (): void => {
    props.setShowOwnedTokensOnly(!props.showOwnedTokensOnly);
  };

  const onShowListedTokensOnlyToggled = (): void => {
    props.setShowListedTokensOnly(!props.showListedTokensOnly);
  };

  const onShouldPlayMusicToggled = (): void => {
    props.setShouldPlayMusic(!props.shouldPlayMusic);
  };

  return (
    <Stack direction={Direction.Vertical} isFullHeight={true} isScrollableVertically={true} contentAlignment={Alignment.Start} shouldAddGutters={true} padding={PaddingSize.Wide} paddingRight={PaddingSize.Default}>
      {props.shouldShowMusicOption && (
        <Checkbox text='Play music' isChecked={props.shouldPlayMusic} onToggled={onShouldPlayMusicToggled} />
      )}
      {props.account && (
        <Checkbox text='Your tokens only' isChecked={props.showOwnedTokensOnly} onToggled={onShowOwnedTokensOnlyToggled} />
      )}
      {props.account && (
        <Checkbox text='Listed tokens only' isChecked={props.showListedTokensOnly} onToggled={onShowListedTokensOnlyToggled} />
      )}
      {props.collectionAttributes && props.collectionAttributes.map((collectionAttribute: CollectionAttribute): React.ReactElement => (
        <Stack key={collectionAttribute.name} direction={Direction.Vertical} contentAlignment={Alignment.Start} paddingBottom={PaddingSize.Wide} shouldAddGutters={true}>
          <Text variant='bold-large'>{collectionAttribute.name}</Text>
          <OptionSelect
            placeholderText='Select'
            optionTextVariant='dark'
            options={getOptions(collectionAttribute)}
            onItemClicked={(itemKey: string) => props.onAttributeValueClicked(collectionAttribute.name, itemKey)}
            selectedItemKey={getSelectedOptionKey(collectionAttribute)}
          />
        </Stack>
      ))}
    </Stack>
  );
};
