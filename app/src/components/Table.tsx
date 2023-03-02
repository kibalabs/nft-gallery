import React from 'react';

import { getClassName, RecursivePartial } from '@kibalabs/core';
import { IMultiAnyChildProps } from '@kibalabs/core-react';
import { defaultComponentProps, IBoxTheme, IComponentProps, themeToCss, ThemeType } from '@kibalabs/ui-react';
import styled from 'styled-components';

export interface ITableTheme extends ThemeType {
  background: IBoxTheme;
  // NOTE(krishan711): should this have header, body, row background fields too?
}

export const TableThemedStyle = (theme: RecursivePartial<ITableTheme>): string => `
  ${themeToCss(theme.background)};
`;

interface IStyledTableProps {
  $theme?: RecursivePartial<ITableTheme>;
}

export const StyledTable = styled.table<IStyledTableProps>`
  width: 100%;
  height: 100%;
  overflow: auto;

  && {
    ${(props: IStyledTableProps): string => (props.$theme ? TableThemedStyle(props.$theme) : '')};
  }
`;

export interface ITableProps extends IComponentProps<ITableTheme>, IMultiAnyChildProps {
}

export const Table = (props: ITableProps): React.ReactElement => {
  return (
    <StyledTable
      id={props.id}
      className={getClassName(Table.displayName, ...(props.variant?.split('-') || []))}
      $theme={props.theme}
    >
      {props.children}
    </StyledTable>
  );
};
Table.displayName = 'Table';
Table.defaultProps = {
  ...defaultComponentProps,
};
