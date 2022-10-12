import React from 'react';

import { ETHER } from '@kibalabs/core';
import { Alignment, Button, Checkbox, Direction, PaddingSize, SingleLineInput, Spacing, Stack, StatefulTitledCollapsibleBox, Text } from '@kibalabs/ui-react';
import { BigNumber } from 'ethers';

import { Account } from '../AccountContext';
import { Collection, CollectionAttribute } from '../client';


export interface IFilterProps {
  account: Account | null | undefined;
  collection: Collection;
  collectionAttributes: CollectionAttribute[];
  filters: Record<string, string[]>;
  onAttributeValueClicked: (attributeName: string, attributeValue: string | null | undefined) => void;
  showOwnedTokensOnly: boolean;
  setShowOwnedTokensOnly: (newShowOwnedTokensOnly: boolean) => void;
  showListedTokensOnly: boolean;
  setShowListedTokensOnly: (newShowListedTokensOnly: boolean) => void;
  shouldShowMusicOption: boolean;
  shouldPlayMusic: boolean;
  setShouldPlayMusic: (newShouldPlayMusic: boolean) => void;
  shouldShowMarket: boolean;
  minPrice: BigNumber | null;
  setMinPrice: (value: BigNumber | null) => void;
  maxPrice: BigNumber | null;
  setMaxPrice: (value: BigNumber | null) => void;
  shouldShowDoneButton?: boolean;
  onDoneClicked: () => void;
}

export const Filter = (props: IFilterProps): React.ReactElement => {
  const [minPriceString, setMinPriceString] = React.useState<string | null>(null);
  const [minPriceError, setMinPriceError] = React.useState<boolean | null>(null);
  const [maxPriceString, setMaxPriceString] = React.useState<string | null>(null);
  const [maxPriceError, setMaxPriceError] = React.useState<boolean | null>(null);

  const onShowOwnedTokensOnlyToggled = (): void => {
    props.setShowOwnedTokensOnly(!props.showOwnedTokensOnly);
  };

  const onShowListedTokensOnlyToggled = (): void => {
    props.setShowListedTokensOnly(!props.showListedTokensOnly);
  };

  const onShouldPlayMusicToggled = (): void => {
    props.setShouldPlayMusic(!props.shouldPlayMusic);
  };

  const onMinPriceChanged = (value: string): void => {
    setMinPriceString(value);
    if (value && !Number(value)) {
      setMinPriceError(true);
      props.setMinPrice(null);
    } else {
      setMinPriceError(false);
      props.setMinPrice(ETHER.mul(Number(value) * 1000000).div(1000000));
    }
  };

  const onMaxPriceChanged = (value: string): void => {
    setMaxPriceString(value);
    if (value && !Number(value)) {
      setMaxPriceError(true);
      props.setMaxPrice(null);
    } else {
      setMaxPriceError(false);
      props.setMaxPrice(ETHER.mul(Number(value) * 1000000).div(1000000));
    }
  };

  return (
    <Stack direction={Direction.Vertical} isFullHeight={true} isScrollableVertically={true} contentAlignment={Alignment.Start} shouldAddGutters={true} padding={PaddingSize.Wide} paddingRight={PaddingSize.Default}>
      {props.shouldShowMusicOption && (
        <Checkbox text='Play music' isChecked={props.shouldPlayMusic} onToggled={onShouldPlayMusicToggled} />
      )}
      {props.account && (
        <Checkbox text='Your tokens only' isChecked={props.showOwnedTokensOnly} onToggled={onShowOwnedTokensOnlyToggled} />
      )}
      <Spacing />
      {props.shouldShowMarket && (
        <StatefulTitledCollapsibleBox title='Market' isCollapsedInitially={true}>
          <Stack direction={Direction.Vertical} shouldAddGutters={true}>
            <Checkbox text='Listed' isChecked={props.showListedTokensOnly} onToggled={onShowListedTokensOnlyToggled} />
            {/* <Stack.Item gutterBefore={PaddingSize.Default} gutterAfter={PaddingSize.Narrow2}>
              <Text variant='note'>Price</Text>
            </Stack.Item> */}
            <Stack direction={Direction.Horizontal} shouldAddGutters={true} isFullWidth={true} childAlignment={Alignment.Center}>
              <Stack.Item shrinkFactor={1} growthFactor={1} shouldShrinkBelowContentSize={true}>
                <SingleLineInput
                  value={minPriceString}
                  onValueChanged={onMinPriceChanged}
                  placeholderText='Min'
                  inputWrapperVariant={minPriceError ? 'error' : 'default'}
                />
              </Stack.Item>
              <Text>to</Text>
              <Stack.Item shrinkFactor={1} growthFactor={1} shouldShrinkBelowContentSize={true}>
                <SingleLineInput
                  value={maxPriceString}
                  onValueChanged={onMaxPriceChanged}
                  placeholderText='Max'
                  inputWrapperVariant={maxPriceError ? 'error' : 'default'}
                />
              </Stack.Item>
            </Stack>
          </Stack>
        </StatefulTitledCollapsibleBox>
      )}
      <Spacing />
      {props.collectionAttributes && props.collectionAttributes.map((collectionAttribute: CollectionAttribute): React.ReactElement => (
        <StatefulTitledCollapsibleBox key={collectionAttribute.name} title={collectionAttribute.name} isCollapsedInitially={true}>
          <Stack direction={Direction.Vertical}>
            {collectionAttribute.values.map((value: string): React.ReactElement => (
              <Checkbox
                key={value}
                text={value}
                isChecked={props.filters[collectionAttribute.name] && props.filters[collectionAttribute.name].includes(value)}
                onToggled={(): void => props.onAttributeValueClicked(collectionAttribute.name, value)}
              />
            ))}
          </Stack>
        </StatefulTitledCollapsibleBox>
      ))}
      <Spacing />
      {props.shouldShowDoneButton && (
        <Button variant='tertiary' text={'DONE'} onClicked={props.onDoneClicked} />
      )}
    </Stack>
  );
};
