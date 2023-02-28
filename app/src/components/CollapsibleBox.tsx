import React from 'react';

import { getClassName } from '@kibalabs/core';
import { ISingleAnyChildProps } from '@kibalabs/core-react';
import { defaultComponentProps, HidingView, IComponentProps, ITitledCollapsibleBoxTheme, KibaIcon, themeToCss, useBuiltTheme } from '@kibalabs/ui-react';
import styled from 'styled-components';


interface IStyledCollapsibleBoxProps {
  $theme: ITitledCollapsibleBoxTheme;
}

const StyledCollapsibleBox = styled.div<IStyledCollapsibleBoxProps>`
  width: 100%;
  overflow: hidden;
  ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.normal.default.background)};

  &.collapsed {
    ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.collapsed?.default?.background)};
  }
`;

const StyledHeader = styled.div<IStyledCollapsibleBoxProps>`
  display: flex;
  flex-direction: horizontal;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
    ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.normal.default.headerBackground)};

  &:hover {
    ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.normal.hover?.headerBackground)};
  }

  &:active {
    ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.normal.press?.headerBackground)};
  }

  &.collapsed {
    ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.collapsed?.default?.headerBackground)};

    &:hover {
      ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.collapsed?.hover?.headerBackground)};
    }

    &:active {
      ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.collapsed?.press?.headerBackground)};
    }
  }
`;

const StyledContent = styled.div<IStyledCollapsibleBoxProps>`
  width: 100%;
  transition: height 0.3s;
  ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.normal.default.contentBackground)};

  &.collapsed {
    height: 0;
    ${(props: IStyledCollapsibleBoxProps): string => themeToCss(props.$theme.collapsed?.default?.contentBackground)};
  }
`;

interface ICollapsibleBoxProps extends IComponentProps<ITitledCollapsibleBoxTheme>, ISingleAnyChildProps {
  headerView: React.ReactNode;
  isCollapsed: boolean;
  onCollapseToggled(): void;
  shouldSkipRenderingWhenCollapsed?: boolean;
}

export const CollapsibleBox = (props: ICollapsibleBoxProps): React.ReactElement => {
  const onCollapseToggled = (): void => {
    props.onCollapseToggled();
  };

  const theme = useBuiltTheme('titledCollapsibleBoxes', props.variant, props.theme);
  return (
    <StyledCollapsibleBox
      id={props.id}
      className={getClassName(CollapsibleBox.displayName, props.className, props.isCollapsed && 'collapsed')}
      $theme={theme}
    >
      <StyledHeader
        className={getClassName(props.isCollapsed && 'collapsed')}
        $theme={theme}
        onClick={onCollapseToggled}
      >
        {props.headerView}
        <KibaIcon iconId={props.isCollapsed ? 'ion-chevron-down' : 'ion-chevron-up'} />
      </StyledHeader>
      {(!props.isCollapsed || !props.shouldSkipRenderingWhenCollapsed) && (
        <HidingView isHidden={props.isCollapsed}>
          <StyledContent $theme={theme} className={getClassName(props.isCollapsed && 'collapsed')}>
            {props.children}
          </StyledContent>
        </HidingView>
      )}
    </StyledCollapsibleBox>
  );
};

CollapsibleBox.displayName = 'CollapsibleBox';
CollapsibleBox.defaultProps = {
  ...defaultComponentProps,
};


interface IStatefulCollapsibleBoxProps extends IComponentProps<ITitledCollapsibleBoxTheme>, ISingleAnyChildProps {
  headerView: React.ReactNode;
  isCollapsedInitially?: boolean;
  shouldSkipRenderingWhenCollapsed?: boolean;
}

export const StatefulCollapsibleBox = (props: IStatefulCollapsibleBoxProps): React.ReactElement => {
  const [isCollapsed, setIsCollapsed] = React.useState(!!props.isCollapsedInitially);
  const onCollapseToggled = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <CollapsibleBox
      id={props.id}
      className={getClassName(StatefulCollapsibleBox.displayName, props.className)}
      theme={props.theme}
      variant={props.variant}
      headerView={props.headerView}
      isCollapsed={isCollapsed}
      onCollapseToggled={onCollapseToggled}
      shouldSkipRenderingWhenCollapsed={props.shouldSkipRenderingWhenCollapsed}
    >
      {props.children}
    </CollapsibleBox>
  );
};

StatefulCollapsibleBox.displayName = 'StatefulCollapsibleBox';
StatefulCollapsibleBox.defaultProps = {
  ...defaultComponentProps,
};
