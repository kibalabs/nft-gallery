import React from 'react';

import { getClassName, RecursivePartial } from '@kibalabs/core';
import { defaultComponentProps, IBoxTheme, IComponentProps, ITextTheme, KibaIcon, themeToCss, ThemeType, useBuiltTheme } from '@kibalabs/ui-react';
import styled from 'styled-components';


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
  $theme: INumberPagerItemTheme;
}

const StyledNumberPager = styled.ul`
  display: flex;
  flex-direction: row;
  width: 100%;
  list-style-type: none;
  margin: 0;
`;

const StyledNumberPagerItem = styled.li<IStyledNumberPagerItemProps>`
  ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.default.background)};
  ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.default.text)};
  cursor: pointer;
  outline: none;
  transition-duration: 0.3s;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  /* padding: 0 12px;
  height: 32px;
  text-align: center;
  margin: auto 4px;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  box-sizing: border-box;
  align-items: center;
  letter-spacing: 0.01071em; */

  &::before {
    content: none;
  }

  &:hover {
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.hover?.background)};
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.hover?.text)};
  }
  &:active {
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.press?.background)};
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.press?.text)};
  }
  &:focus {
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.focus?.background)};
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.normal.focus?.text)};
  }
  &.active {
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.default?.background)};
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.default?.text)};
    &:hover {
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.hover?.background)};
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.hover?.text)};
    }
    &:active {
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.press?.background)};
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.press?.text)};
    }
    &:focus {
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.focus?.background)};
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.active?.focus?.text)};
    }
  }
  &.disabled {
    pointer-events: none;
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.default?.background)};
    ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.default?.text)};
    &:hover {
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.hover?.background)};
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.hover?.text)};
    }
    &:active {
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.press?.background)};
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.press?.text)};
    }
    &:focus {
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.focus?.background)};
      ${(props: IStyledNumberPagerItemProps): string => themeToCss(props.$theme.disabled?.focus?.text)};
    }
  }
`;

interface INumberPagerProps extends IComponentProps<INumberPagerItemTheme> {
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
  const itemTheme = useBuiltTheme('numberPagerItems', props.variant, props.theme);
  // if (props.pageCount == null && props.pageCountResponsive?.base == null) {
  //   throw new Error(`One of {pageCount, pageCountResponsive.base} must be passed to ${NumberPager.displayName}`);
  // }

  // const pageCount = props.pageCountResponsive?.base || props.pageCount || 12;
  // const pageCountSmall = props.pageCountResponsive?.small || pageCount;
  // const pageCountMedium = props.pageCountResponsive?.medium || pageCountSmall;
  // const pageCountLarge = props.pageCountResponsive?.large || pageCountMedium;
  // const pageCountExtraLarge = props.pageCountResponsive?.extraLarge || pageCountLarge;
  // const pageCounts = [pageCount, pageCountSmall, pageCountMedium, pageCountLarge, pageCountExtraLarge];
  // const maxPageCount = Math.max(...(pageCounts.filter((candidatePageCount?: number): boolean => candidatePageCount !== undefined)));

  // const onPageClicked = (pageIndex: number): void => {
  //   if (props.onPageClicked) {
  //     props.onPageClicked(pageIndex);
  //   }
  // };

  // const getHiddenAboveSize = (index: number): ScreenSize | undefined => {
  //   if (index >= pageCountSmall) {
  //     return ScreenSize.Small;
  //   }
  //   if (index >= pageCountMedium) {
  //     return ScreenSize.Medium;
  //   }
  //   if (index >= pageCountLarge) {
  //     return ScreenSize.Large;
  //   }
  //   if (index >= pageCountExtraLarge) {
  //     return ScreenSize.ExtraLarge;
  //   }
  //   return undefined;
  // };

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
      <StyledNumberPagerItem $theme={itemTheme} className={getClassName(props.activePage === 0 && 'disabled')} onClick={onPreviousClicked}>
        <KibaIcon variant='small' iconId='ion-caret-back' />
      </StyledNumberPagerItem>
      {paginationRange.map((page: string | number): React.ReactElement => (
        <React.Fragment key={String(page)}>
          { page === DOTS ? (
            <StyledNumberPagerItem $theme={itemTheme} className='dots'>&#8230;</StyledNumberPagerItem>
          ) : (
            <StyledNumberPagerItem $theme={itemTheme} className={getClassName(props.activePage === page && 'active')} onClick={(): void => onPageClicked(page as number)}>
              {(page as number) + 1}
            </StyledNumberPagerItem>
          )}
        </React.Fragment>
      ))}
      <StyledNumberPagerItem $theme={itemTheme} className={getClassName(props.activePage === props.pageCount - 1 && 'disabled')} onClick={onNextClicked}>
        <KibaIcon variant='small' iconId='ion-caret-forward' />
      </StyledNumberPagerItem>
    </StyledNumberPager>
  );
};

NumberPager.displayName = 'NumberPager';
NumberPager.defaultProps = {
  ...defaultComponentProps,
};
