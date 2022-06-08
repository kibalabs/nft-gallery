import React from 'react';

import { Alignment, Checkbox, Direction, IOption, OptionSelect, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { Account } from '../AccountContext';
import { TokenCollection, TokenCollectionAttribute } from '../model';


export interface IFilterProps {
  account: Account | null | undefined;
  tokenCollection: TokenCollection;
  filters: Record<string, string>;
  onAttributeValueClicked: (attributeName: string, attributeValue: string | null | undefined) => void;
  showOwnedTokensOnly: boolean;
  setShowOwnedTokensOnly: (newShowOwnedTokensOnly: boolean) => void;
  shouldShowMusicOption: boolean;
  shouldPlayMusic: boolean;
  setShouldPlayMusic: (newShouldPlayMusic: boolean) => void;
}

export const Filter = (props: IFilterProps): React.ReactElement => {
  const getOptions = (attribute: TokenCollectionAttribute): IOption[] => {
    return Object.keys(attribute.values).map((valueKey: string): IOption => ({
      text: attribute.values[valueKey].name,
      itemKey: attribute.values[valueKey].name,
      // listItemVariant?: string;
      // textVariant?: string;
      // isDisabled?: boolean;
    }));
  };

  const getSelectedOptionKey = (attribute: TokenCollectionAttribute): string | undefined => {
    return props.filters[attribute.name];
  };

  const onShowOwnedTokensOnlyToggled = (): void => {
    props.setShowOwnedTokensOnly(!props.showOwnedTokensOnly);
  };

  const onShouldPlayMusicToggled = (): void => {
    props.setShouldPlayMusic(!props.shouldPlayMusic);
  };

  // NOTE(krishan711): not sure why but this re-aliasing fixes some type checks
  const attributes = props.tokenCollection.attributes;

  return (
    <Stack direction={Direction.Vertical} isFullHeight={true} isScrollableVertically={true} contentAlignment={Alignment.Start} shouldAddGutters={true} paddingRight={PaddingSize.Default}>
      {props.shouldShowMusicOption && (
        <Checkbox text='Play music' isChecked={props.shouldPlayMusic} onToggled={onShouldPlayMusicToggled} />
      )}
      {props.account && (
        <Checkbox text='Show owned tokens only' isChecked={props.showOwnedTokensOnly} onToggled={onShowOwnedTokensOnlyToggled} />
      )}
      {attributes && Object.keys(attributes).map((attributeKey: string): React.ReactElement => (
        <Stack key={attributes[attributeKey].name} direction={Direction.Vertical} contentAlignment={Alignment.Start} paddingBottom={PaddingSize.Wide} shouldAddGutters={true}>
          <Text variant='bold-large'>{attributes[attributeKey].name}</Text>
          <OptionSelect
            options={getOptions(attributes[attributeKey])}
            onItemClicked={(itemKey: string) => props.onAttributeValueClicked(attributes[attributeKey].name, itemKey)}
            selectedItemKey={getSelectedOptionKey(attributes[attributeKey])}
          />
          {/* {Object.keys(tokenCollection.attributes[attributeKey].values).map((valueKey: string): React.ReactElement => (
            <LinkBase key={valueKey} onClicked={(): void => onAttributeValueClicked(attributeKey, valueKey)} isFullWidth={true}>
              <Stack direction={Direction.Horizontal} contentAlignment={Alignment.Fill} isFullWidth={true}>
                <Text>{tokenCollection.attributes[attributeKey].values[valueKey].name || 'none'}</Text>
                <Text variant='note'>{tokenCollection.attributes[attributeKey].values[valueKey].tokenIds.length}</Text>
              </Stack>
            </LinkBase>
          ))} */}
        </Stack>
      ))}
    </Stack>
  );
};
