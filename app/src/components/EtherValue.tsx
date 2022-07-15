import React from 'react';

import { Direction, IComponentProps, Stack, Text, PaddingSize, Spacing, useBuiltTheme, Alignment } from '@kibalabs/ui-react';

interface IEtherValueProps {
  value: string;
  textVariant?: string;
}

export const EtherValue = (props: IEtherValueProps): React.ReactElement => {
  const textVariant = props.textVariant || 'default';
  const textTheme = useBuiltTheme('texts', textVariant);
  const height = textTheme['line-height'] || '1em';
  return (
    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center}>
      <svg fill='currentColor' width={`calc(0.3 * ${height})`} height={`calc(0.6 * ${height})`} viewBox="0 0 14 26" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 0 14 13 7 18 0 13M0 15 7 26 14 15 7 20"></path>
      </svg>
      <Spacing variant={PaddingSize.Narrow} />
      <Text variant={textVariant}>{props.value}</Text>
    </Stack>
  );
};

EtherValue.displayName = 'EtherValue';
EtherValue.defaultProps = {
  className: '',
};
