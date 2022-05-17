import React from 'react';

import { Alignment, Direction, IOption, OptionSelect, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { TokenCollection, TokenCollectionAttribute } from '../model';


export interface IFilterProps {
  tokenCollection: TokenCollection;
  filters: Record<string, string>;
  onAttributeValueClicked: (attributeName: string, attributeValue: string | null | undefined) => void;
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

  return (
    <Stack direction={Direction.Vertical} isFullHeight={true} isScrollableVertically={true} contentAlignment={Alignment.Start} shouldAddGutters={true} paddingRight={PaddingSize.Default}>
      {Object.keys(props.tokenCollection.attributes).map((attributeKey: string): React.ReactElement => (
        <Stack key={props.tokenCollection.attributes[attributeKey].name} direction={Direction.Vertical} contentAlignment={Alignment.Start} paddingBottom={PaddingSize.Wide} shouldAddGutters={true}>
          <Text variant='bold-large'>{props.tokenCollection.attributes[attributeKey].name}</Text>
          <OptionSelect
            options={getOptions(props.tokenCollection.attributes[attributeKey])}
            onItemClicked={(itemKey: string) => props.onAttributeValueClicked(props.tokenCollection.attributes[attributeKey].name, itemKey)}
            selectedItemKey={getSelectedOptionKey(props.tokenCollection.attributes[attributeKey])}
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
