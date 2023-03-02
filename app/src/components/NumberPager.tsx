import React from 'react';

import { getClassName, RecursivePartial } from '@kibalabs/core';
import { ISingleAnyChildProps } from '@kibalabs/core-react';
import { defaultComponentProps, IBoxTheme, IComponentProps, IMoleculeProps, ITextTheme, KibaIcon, themeToCss, ThemeType } from '@kibalabs/ui-react';
import styled from 'styled-components';

export const NumberPagerItemThemedStyle = (theme: RecursivePartial<INumberPagerItemTheme>): string => `
  ${themeToCss(theme.normal?.default?.background)};
  ${themeToCss(theme.normal?.default?.text)};

  &:hover {
    ${themeToCss(theme.normal?.hover?.background)};
    ${themeToCss(theme.normal?.hover?.text)};
  }
  &:active {
    ${themeToCss(theme.normal?.press?.background)};
    ${themeToCss(theme.normal?.press?.text)};
  }
  &:focus {
    ${themeToCss(theme.normal?.focus?.background)};
    ${themeToCss(theme.normal?.focus?.text)};
  }
  &.active {
    ${themeToCss(theme.active?.default?.background)};
    ${themeToCss(theme.active?.default?.text)};
    &:hover {
      ${themeToCss(theme.active?.hover?.background)};
      ${themeToCss(theme.active?.hover?.text)};
    }
    &:active {
      ${themeToCss(theme.active?.press?.background)};
      ${themeToCss(theme.active?.press?.text)};
    }
    &:focus {
      ${themeToCss(theme.active?.focus?.background)};
      ${themeToCss(theme.active?.focus?.text)};
    }
  }
  &.disabled {
    ${themeToCss(theme.disabled?.default?.background)};
    ${themeToCss(theme.disabled?.default?.text)};
    &:hover {
      ${themeToCss(theme.disabled?.hover?.background)};
      ${themeToCss(theme.disabled?.hover?.text)};
    }
    &:active {
      ${themeToCss(theme.disabled?.press?.background)};
      ${themeToCss(theme.disabled?.press?.text)};
    }
    &:focus {
      ${themeToCss(theme.disabled?.focus?.background)};
      ${themeToCss(theme.disabled?.focus?.text)};
    }
  }
`;

export interface INumberPagerItemThemeBase extends ThemeType {
  background: IBoxTheme;
  text: ITextTheme;
}

export interface INumberPagerItemThemeState extends ThemeType {
  default: INumberPagerItemThemeBase;
  hover: RecursivePartial<INumberPagerItemThemeBase>;
  press: RecursivePartial<INumberPagerItemThemeBase>;
  focus: RecursivePartial<INumberPagerItemThemeBase>;
}

export interface INumberPagerItemTheme extends ThemeType {
  normal: INumberPagerItemThemeState;
  active: RecursivePartial<INumberPagerItemThemeState>;
  disabled: RecursivePartial<INumberPagerItemThemeState>;
}

interface IStyledNumberPagerItemProps {
  $theme?: RecursivePartial<INumberPagerItemTheme>;
}

const StyledNumberPagerItem = styled.li<IStyledNumberPagerItemProps>`
  cursor: pointer;
  outline: none;
  transition-duration: 0.3s;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: none;
  }
  &.disabled {
    pointer-events: none;
  }

  && {
    ${(props: IStyledNumberPagerItemProps): string => (props.$theme ? NumberPagerItemThemedStyle(props.$theme) : '')};
  }
`;

interface INumberPagerItemProps extends IComponentProps<INumberPagerItemTheme>, ISingleAnyChildProps {
  isActive?: boolean;
  isDisabled?: boolean;
  onClicked?: () => void;
}

export const NumberPagerItem = (props: INumberPagerItemProps): React.ReactElement => {
  return (
    <StyledNumberPagerItem
      id={props.id}
      className={getClassName(props.className, NumberPagerItem.displayName, props.isDisabled && 'disabled', props.isActive && 'active')}
      $theme={props.theme}
      onClick={props.onClicked}
    >
      {props.children}
    </StyledNumberPagerItem>
  );
};
NumberPagerItem.displayName = 'KibaNumberPagerItem';

const StyledNumberPager = styled.ul`
  display: flex;
  flex-direction: row;
  width: 100%;
  list-style-type: none;
  margin: 0;
`;

interface INumberPagerTheme {
  itemTheme: INumberPagerItemTheme;
}

interface INumberPagerProps extends IMoleculeProps<INumberPagerTheme> {
  pageCount: number;
  activePage: number;
  siblingPageCount?: number;
  // siblingPageCountResponsive?: ResponsiveField<number>;
  onPageClicked(index: number): void;
}

const createRange = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_: unknown, index: number): number => index + start);
};

export const NumberPager = (props: INumberPagerProps): React.ReactElement => {
  const DOTS = '...';
  const siblingPageCount = props.siblingPageCount ?? 5;
  const paginationRange = React.useMemo((): (string | number)[] => {
    // Pages count = siblingPageCount + firstPage? + lastPage? + 1 + 2*DOTS?
    const totalPageNumbers = siblingPageCount + 5;
    const firstPageIndex = 0;
    const lastPageIndex = props.pageCount - 1;

    // Case 1: If the number of pages is less than the page numbers we want to show in our
    // paginationComponent, we return the range [1..props.pageCount]
    if (totalPageNumbers >= props.pageCount) {
      return createRange(firstPageIndex, lastPageIndex);
    }

    // Calculate left and right sibling index and make sure they are within range 0 and props.pageCount
    const leftSiblingIndex = Math.max(props.activePage - siblingPageCount, 0);
    const rightSiblingIndex = Math.min(props.activePage + siblingPageCount, lastPageIndex);

    // We do not show dots just when there is just one page number to be inserted between the extremes of sibling and
    // the page limits i.e 0 and props.pageCount-1. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < props.pageCount - 2
    const shouldShowLeftDots = leftSiblingIndex > firstPageIndex + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPageIndex - 1;

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingPageCount;
      const leftRange = createRange(0, leftItemCount);
      return [...leftRange, DOTS, lastPageIndex];
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingPageCount;
      const rightRange = createRange(lastPageIndex - rightItemCount + 1, lastPageIndex);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [props.pageCount, siblingPageCount, props.activePage]);

  const onNextClicked = (): void => {
    onPageClicked(props.activePage + 1);
  };

  const onPreviousClicked = (): void => {
    onPageClicked(props.activePage - 1);
  };

  const onPageClicked = (page: number): void => {
    props.onPageClicked(page);
  };

  return (
    <StyledNumberPager
      id={props.id}
      className={getClassName(NumberPager.displayName, props.className)}
    >
      <NumberPagerItem theme={props.theme?.itemTheme} isDisabled={props.activePage === 0} onClicked={onPreviousClicked}>
        <KibaIcon variant='small' iconId='ion-caret-back' />
      </NumberPagerItem>
      {paginationRange.map((page: string | number, index: number): React.ReactElement => (
        <React.Fragment key={`${page}-${index}`}>
          { page === DOTS ? (
            <NumberPagerItem theme={props.theme?.itemTheme}>&#8230;</NumberPagerItem>
          ) : (
            <NumberPagerItem theme={props.theme?.itemTheme} isActive={props.activePage === page} onClicked={(): void => onPageClicked(page as number)}>
              {(page as number) + 1}
            </NumberPagerItem>
          )}
        </React.Fragment>
      ))}
      <NumberPagerItem theme={props.theme?.itemTheme} isDisabled={props.activePage === props.pageCount - 1} onClicked={onNextClicked}>
        <KibaIcon variant='small' iconId='ion-caret-forward' />
      </NumberPagerItem>
    </StyledNumberPager>
  );
};

NumberPager.displayName = 'KibaNumberPager';
NumberPager.defaultProps = {
  ...defaultComponentProps,
};
