import React from 'react';

import { getClassName } from '@kibalabs/core';
import { ISingleAnyChildProps } from '@kibalabs/core-react';
import { defaultComponentProps, IBoxTheme, IComponentProps } from '@kibalabs/ui-react';
import styled from 'styled-components';

// TODO(krishan711): add theming to this
// TODO(krishan711): move to ui-react

interface IFloatingViewProps extends IComponentProps<IBoxTheme>, ISingleAnyChildProps {
  isFullHeight?: boolean;
  isFullWidth?: boolean;
  positionLeft?: string;
  positionTop?: string;
  positionRight?: string;
  positionBottom?: string;
  zIndex?: string;
}

interface IStyledFloatingViewProps {
  $positionLeft?: string;
  $positionTop?: string;
  $positionRight?: string;
  $positionBottom?: string;
  $zIndex?: string;
}

const StyledFloatingView = styled.div<IStyledFloatingViewProps>`
  position: fixed;
  left: ${(props: IStyledFloatingViewProps): string => props.$positionLeft || 'auto'};
  top: ${(props: IStyledFloatingViewProps): string => props.$positionTop || 'auto'};
  right: ${(props: IStyledFloatingViewProps): string => props.$positionRight || 'auto'};
  bottom: ${(props: IStyledFloatingViewProps): string => props.$positionBottom || 'auto'};
  z-index: ${(props: IStyledFloatingViewProps): string => props.$zIndex || 'auto'};

  &.fullHeight {
    height: 100%;
  }

  &.fullWidth {
    width: 100%;
  }
`;

export const FloatingView = (props: IFloatingViewProps): React.ReactElement => {
  return (
    <StyledFloatingView
      id={props.id}
      className={getClassName(FloatingView.displayName, props.className, props.isFullHeight && 'fullHeight', props.isFullWidth && 'fullWidth')}
      $positionTop={props.positionTop}
      $positionLeft={props.positionLeft}
      $positionRight={props.positionRight}
      $positionBottom={props.positionBottom}
      $zIndex={props.zIndex}
    >
      {props.children}
    </StyledFloatingView>
  );
};

FloatingView.displayName = 'FloatingView';
FloatingView.defaultProps = {
  ...defaultComponentProps,
};
