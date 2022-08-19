import React from 'react';

import { getClassName } from '@kibalabs/core';
import { defaultWrapperProps, getPaddingSize, IDimensionGuide, IWrapperProps, PaddingSizeProp, useDimensions, wrappingComponent } from '@kibalabs/ui-react';
import styled from 'styled-components';


export interface IMarginViewPaddingProps {
  marginTop?: PaddingSizeProp;
  marginBottom?: PaddingSizeProp;
  marginLeft?: PaddingSizeProp;
  marginRight?: PaddingSizeProp;
  marginHorizontal?: PaddingSizeProp;
  marginVertical?: PaddingSizeProp;
  margin?: PaddingSizeProp;
}

interface IStyledMarginViewProps extends IWrapperProps {
  theme: IDimensionGuide;
  marginTop?: PaddingSizeProp;
  marginBottom?: PaddingSizeProp;
  marginLeft?: PaddingSizeProp;
  marginRight?: PaddingSizeProp;
}

const StyledMarginView = wrappingComponent((Component: React.ComponentType<IStyledMarginViewProps>): React.ComponentType<IStyledMarginViewProps> => {
  return styled(Component)<IStyledMarginViewProps>`
    ${(props: IStyledMarginViewProps): string => (props.marginTop ? `margin-top: ${getPaddingSize(props.marginTop, props.theme)}` : '')};
    ${(props: IStyledMarginViewProps): string => (props.marginBottom ? `margin-bottom: ${getPaddingSize(props.marginBottom, props.theme)}` : '')};
    ${(props: IStyledMarginViewProps): string => (props.marginLeft ? `margin-left: ${getPaddingSize(props.marginLeft, props.theme)}` : '')};
    ${(props: IStyledMarginViewProps): string => (props.marginRight ? `margin-right: ${getPaddingSize(props.marginRight, props.theme)}` : '')};
  `;
});

export interface IMarginViewProps extends IWrapperProps, IMarginViewPaddingProps {
  theme?: IDimensionGuide;
}

export const MarginView = (props: IMarginViewProps): React.ReactElement => {
  const theme = useDimensions(props.theme);
  const marginTop = props.marginTop || props.marginVertical || props.margin;
  const marginBottom = props.marginBottom || props.marginVertical || props.margin;
  const marginRight = props.marginRight || props.marginHorizontal || props.margin;
  const marginLeft = props.marginLeft || props.marginHorizontal || props.margin;
  return (
    <StyledMarginView
      className={getClassName(MarginView.displayName, props.className)}
      theme={theme}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginRight={marginRight}
      marginLeft={marginLeft}
    >
      {props.children}
    </StyledMarginView>
  );
};

MarginView.displayName = 'MarginView';
MarginView.defaultProps = {
  ...defaultWrapperProps,
};
