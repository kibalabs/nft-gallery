import React from 'react';

import { dateToRelativeString, getClassName, RecursivePartial } from '@kibalabs/core';
import { SubRouterOutlet, useIntegerUrlQueryState, useLocation, useNavigator, useUrlQueryState } from '@kibalabs/core-react';
import { Alignment, Box, Button, ColorSettingView, Dialog, Direction, Head, HidingView, IBoxTheme, IconButton, Image, ITextTheme, KibaIcon, LinkBase, List, LoadingSpinner, OptionSelect, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, Text, TextAlignment, themeToCss, ThemeType, useBuiltTheme, useResponsiveScreenSize } from '@kibalabs/ui-react';
import styled from 'styled-components';

import { useAccount, useLoginSignature, useOnLoginClicked } from '../../AccountContext';
import { CollectionToken, GalleryUser, GalleryUserRow, ListResponse } from '../../client';
import { AccountViewLink } from '../../components/AccountView';
import { MarginView } from '../../components/MarginView';
import { NumberPager } from '../../components/NumberPager';
import { useGlobals } from '../../globalsContext';
import { getChain, isMembersEnabled } from '../../util';


interface ITableTheme extends ThemeType {
  background: IBoxTheme;
  // NOTE(krishan711): this could have header, body, row background fields too
}

interface IStyledTableProps {
  $theme: ITableTheme;
}

const StyledTable = styled.table<IStyledTableProps>`
  ${(props: IStyledTableProps): string => themeToCss(props.$theme.background)};
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export interface ITableCellThemeBase extends ThemeType {
  text: ITextTheme;
  background: IBoxTheme;
}

export interface ITableCellThemeState extends ThemeType {
  default: ITableCellThemeBase;
  hover: RecursivePartial<ITableCellThemeBase>;
  press: RecursivePartial<ITableCellThemeBase>;
  focus: RecursivePartial<ITableCellThemeBase>;
}

export interface ITableCellTheme extends ThemeType {
  normal: ITableCellThemeState;
  disabled: RecursivePartial<ITableCellThemeState>;
}


interface IStyledTableHeadProps {

}

const StyledTableHead = styled.thead<IStyledTableHeadProps>`

`;

interface IStyledTableHeadRowProps {

}

const StyledTableHeadRow = styled.tr<IStyledTableHeadRowProps>`
`;

interface IStyledTableHeadRowItemProps {
  $theme: ITableCellTheme;
}

const StyledTableHeadRowItem = styled.td<IStyledTableHeadRowItemProps>`
  ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.default.text)};
  ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.default.background)};
  /* TODO(krishan711): add the disabled styles */

  &.clickable {
    cursor: pointer;
    &:hover {
      ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.hover?.text)};
      ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.hover?.background)};
    }
    &:active {
      ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.press?.text)};
      ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.press?.background)};
    }
    &:focus {
      ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.focus?.text)};
      ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.focus?.background)};
    }
  }
`;

interface IStyledTableBodyProps {

}

const StyledTableBody = styled.tbody<IStyledTableBodyProps>`

`;

interface IStyledTableBodyRowProps {

}

const StyledTableBodyRow = styled.tr<IStyledTableBodyRowProps>`
  overflow: hidden;
`;

interface IStyledTableBodyRowItemProps {
  $theme: ITableCellTheme;
}

const StyledTableBodyRowItem = styled.td<IStyledTableBodyRowItemProps>`
  ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.default.text)};
  ${(props: IStyledTableHeadRowItemProps): string => themeToCss(props.$theme.normal.default.background)};
  /* TODO(krishan711): add the clickable styles */
`;

interface IUserCellContentProps {
  row: GalleryUserRow;
}

const UserCellContent = (props: IUserCellContentProps): React.ReactElement => {
  return (
    <Stack direction={Direction.Horizontal} isFullWidth={false} contentAlignment={Alignment.Start} childAlignment={Alignment.Center} shouldAddGutters={true}>
      <AccountViewLink address={props.row.galleryUser.address} target={`/accounts/${props.row.galleryUser.address}`} />
      {props.row.galleryUser.twitterProfile && (
        <IconButton variant='small' icon={<KibaIcon variant='small' iconId='ion-logo-twitter' /> } target={`https://twitter.com/${props.row.galleryUser.twitterProfile.username}`} />
      )}
    </Stack>
  );
};

interface IOwnedTokensCellContentProps {
  row: GalleryUserRow;
}

const OwnedTokensCellContent = (props: IOwnedTokensCellContentProps): React.ReactElement => {
  return (
    <Stack direction={Direction.Horizontal} isFullWidth={false} contentAlignment={Alignment.Start} shouldAddGutters={true}>
      <Text alignment={TextAlignment.Center}>{props.row.galleryUser.ownedTokenCount}</Text>
      <Spacing variant={PaddingSize.Default} />
      <React.Fragment>
        {props.row.chosenOwnedTokens.slice(0, 7).map((token: CollectionToken): React.ReactElement => (
          <MarginView key={token.tokenId} marginLeft='inverseWide'>
            <LinkBase target={`/members/tokens/${token.tokenId}`}>
              <Box variant='memberToken' isFullWidth={false} shouldClipContent={true}>
                <Image variant='unrounded' isLazyLoadable={true} source={token.resizableImageUrl ?? token.imageUrl ?? ''} alternativeText={token.name} width='1.4em' height='1.4em' />
              </Box>
            </LinkBase>
          </MarginView>
        ))}
      </React.Fragment>
    </Stack>
  );
};

interface IHeaderCellProps {
  headerId: string;
  title: string;
  isOrderable?: boolean;
  orderDirection?: -1 | 1 | null;
  theme: ITableCellTheme;
  onClicked?: (headerId: string) => void;
}

const HeaderCell = (props: IHeaderCellProps): React.ReactElement => {
  if (props.isOrderable && !props.onClicked) {
    throw Error('onClicked must be provided if isOrderable=true');
  }

  const onClicked = (): void => {
    if (props.onClicked) {
      props.onClicked(props.headerId);
    }
  };

  return (
    <StyledTableHeadRowItem
      $theme={props.theme}
      className={getClassName(props.onClicked != null && 'clickable')}
      onClick={onClicked}
    >
      <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignment={Alignment.Start} childAlignment={Alignment.Center} shouldAddGutters={true}>
        <Text variant='bold' tag='span' alignment={TextAlignment.Left}>{props.title}</Text>
        {props.orderDirection && (
          <KibaIcon variant='small' iconId={props.orderDirection === -1 ? 'ion-caret-down-outline' : 'ion-caret-up-outline'} />
        )}
      </Stack>
    </StyledTableHeadRowItem>
  );
};

interface IMemberRowContentProps {
  index: number;
  row: GalleryUserRow;
  isFollowing: boolean;
  onFollowClicked: (galleryUser: GalleryUser) => void;
}

const MemberRowContent = (props: IMemberRowContentProps): React.ReactElement => {
  const onFollowClicked = (): void => {
    props.onFollowClicked(props.row.galleryUser);
  };

  return (
    <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignment={Alignment.Start} shouldAddGutters={true}>
      <Text>{`#${props.index}`}</Text>
      <Stack.Item growthFactor={1} shrinkFactor={1}>
        <Stack direction={Direction.Vertical} contentAlignment={Alignment.Start}>
          <AccountViewLink address={props.row.galleryUser.address} target={`/accounts/${props.row.galleryUser.address}`} />
          {props.row.galleryUser.joinDate ? (
            <Text variant='small'>{`joined ${dateToRelativeString(props.row.galleryUser.joinDate)}`}</Text>
          ) : (
            <Text variant='note'>{'-'}</Text>
          )}
        </Stack>
      </Stack.Item>
      <Box width='3em'>
        <Stack direction={Direction.Vertical} contentAlignment={Alignment.Start} childAlignment={Alignment.End}>
          <Stack direction={Direction.Horizontal} contentAlignment={Alignment.End}>
            <Text>{props.row.galleryUser.ownedTokenCount}</Text>
            <Spacing variant={PaddingSize.Narrow} />
            {props.row.chosenOwnedTokens.length > 0 && (
              <LinkBase target={`/members/tokens/${props.row.chosenOwnedTokens[0].tokenId}`}>
                <Box variant='memberToken-unbordered' isFullWidth={false} shouldClipContent={true}>
                  <Image variant='unrounded' isLazyLoadable={true} source={props.row.chosenOwnedTokens[0].resizableImageUrl ?? props.row.chosenOwnedTokens[0].imageUrl ?? ''} alternativeText={props.row.chosenOwnedTokens[0].name} width='1.4em' height='1.4em' />
                </Box>
              </LinkBase>
            )}
          </Stack>
          {props.row.galleryUser.twitterProfile && (
            <React.Fragment>
              <Stack direction={Direction.Horizontal} contentAlignment={Alignment.End}>
                <Text>{props.row.galleryUser.twitterProfile.followerCount}</Text>
                <IconButton variant='small' icon={<KibaIcon variant='small' iconId='ion-logo-twitter' /> } target={`https://twitter.com/${props.row.galleryUser.twitterProfile.username}`} />
              </Stack>
              {props.isFollowing ? (
                <Text variant='note' shouldBreakAnywhere={false} shouldBreakOnWords={false}>Following</Text>
              ) : (
                <Button variant='small' text='Follow' onClicked={onFollowClicked} />
              )}
            </React.Fragment>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export const MembersPage = (): React.ReactElement => {
  const { projectId } = useGlobals();

  if (getChain(projectId) !== 'ethereum' || !isMembersEnabled(projectId)) {
    return (
      <React.Fragment />
    );
  }

  return <MembersPageReal />;
};

const DUMMY_ROW = new GalleryUserRow(
  new GalleryUser('0x0000000000000000000000000000000000000000', '', null, null, 0, new Date()),
  [
    new CollectionToken('', '', '', '', null, null, null, []),
    new CollectionToken('', '', '', '', null, null, null, []),
    new CollectionToken('', '', '', '', null, null, null, []),
    new CollectionToken('', '', '', '', null, null, null, []),
    new CollectionToken('', '', '', '', null, null, null, []),
  ],
);

export const DEFAULT_SORT = 'FOLLOWERCOUNT_DESC';

export const MembersPageReal = (): React.ReactElement => {
  const screenSize = useResponsiveScreenSize();
  const tableTheme = useBuiltTheme<ITableTheme>('tables');
  const tableHeaderCellTheme = useBuiltTheme<ITableCellTheme>('tableCells', 'header');
  const tableCellTheme = useBuiltTheme<ITableCellTheme>('tableCells');
  const { collection, notdClient } = useGlobals();
  const navigator = useNavigator();
  const location = useLocation();
  const account = useAccount();
  const loginSignature = useLoginSignature();
  const onLoginClicked = useOnLoginClicked();
  const [followedUsers, setFollowedUsers] = React.useState<string[]>([]);
  const [queryOrder, setOrder] = useUrlQueryState('order', undefined, DEFAULT_SORT);
  const [queryPage, setPage] = useIntegerUrlQueryState('page', undefined);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [rows, setRows] = React.useState<GalleryUserRow[] | undefined | null>(undefined);

  const order = queryOrder ?? DEFAULT_SORT;
  const page = queryPage ?? 0;
  const pageSize = 50;
  const [orderField, orderDirection] = order.split('_');
  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

  const updateRows = React.useCallback((): void => {
    setRows(undefined);
    if (!collection?.address) {
      return;
    }
    notdClient.queryCollectionUsers(collection.address, pageSize, pageSize * page, order).then((retrievedGalleryUserRows: ListResponse<GalleryUserRow>): void => {
      setRows(retrievedGalleryUserRows.items);
      setPageCount(Math.ceil(retrievedGalleryUserRows.totalCount / pageSize));
    }).catch((error: unknown): void => {
      console.error(error);
      setRows(null);
    });
  }, [collection?.address, notdClient, order, page, pageSize]);

  React.useEffect((): void => {
    updateRows();
  }, [updateRows]);

  const onHeaderClicked = (headerId: string): void => {
    if (headerId !== orderField) {
      setOrder(`${headerId}_DESC`);
    } else if (orderDirection === 'DESC') {
      setOrder(`${headerId}_ASC`);
    } else {
      setOrder(DEFAULT_SORT);
    }
  };

  const onOrderSelected = (newOrder: string): void => {
    setOrder(newOrder);
  };

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo('/members');
  };

  const onPageClicked = (newPage: number): void => {
    setPage(newPage);
  };

  const onFollowClicked = async (galleryUser: GalleryUser): Promise<void> => {
    if (!galleryUser || !galleryUser.twitterProfile || !collection) {
      return;
    }
    if (!account) {
      window.open(`https://twitter.com/${galleryUser.twitterProfile.username}`);
      return;
    }
    let signature = loginSignature;
    if (!signature) {
      signature = await onLoginClicked();
    }
    if (!signature) {
      window.open(`https://twitter.com/${galleryUser.twitterProfile.username}`);
      return;
    }
    // NOTE(krishan711): this would be better if we knew if the user had logged into twitter already or not
    try {
      await notdClient.followGalleryUser(collection?.address, galleryUser.address, account.address, signature.message, signature.signature);
      setFollowedUsers([...followedUsers, galleryUser.address]);
    } catch (error: unknown) {
      console.error(error);
      window.open(`https://twitter.com/${galleryUser.twitterProfile.username}`);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Members | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
        {collection === undefined || rows === undefined ? (
          <LoadingSpinner />
        ) : collection === null || rows === null ? (
          <Text variant='error'>Failed to load</Text>
        ) : (
          null
        )}
        <HidingView isHidden={rows == null}>
          <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
            <Stack direction={Direction.Horizontal} isFullWidth={true} childAlignment={Alignment.Center}>
              <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                <Box maxWidth='10em'>
                  <OptionSelect
                    selectedItemKey={order}
                    onItemClicked={onOrderSelected}
                    inputWrapperVariant='smallPadding'
                    options={[
                      { itemKey: 'TOKENCOUNT_DESC', text: '↓ Owned' },
                      { itemKey: 'TOKENCOUNT_ASC', text: '↑ Owned' },
                      { itemKey: 'JOINDATE_DESC', text: '↓ Joined' },
                      { itemKey: 'JOINDATE_ASC', text: '↑ Joined' },
                      { itemKey: 'FOLLOWERCOUNT_DESC', text: '↓ Followers' },
                      { itemKey: 'FOLLOWERCOUNT_ASC', text: '↑ Followers' },
                    ]}
                  />
                </Box>
              </ResponsiveHidingView>
              <Spacing />
              <Stack.Item growthFactor={1} shrinkFactor={1}>
                <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                  <Box>
                    <NumberPager
                      pageCount={pageCount}
                      activePage={page}
                      siblingPageCount={0}
                      onPageClicked={onPageClicked}
                    />
                  </Box>
                </ResponsiveHidingView>
              </Stack.Item>
              <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
                <Box maxWidth='400px'>
                  <NumberPager
                    pageCount={pageCount}
                    activePage={page}
                    siblingPageCount={1}
                    onPageClicked={onPageClicked}
                  />
                </Box>
              </ResponsiveHidingView>
            </Stack>
            <Stack.Item growthFactor={1} shrinkFactor={1}>
              <Box variant='borderedLight-unpadded' isScrollableVertically={true}>
                {screenSize === ScreenSize.Base || screenSize === ScreenSize.Small ? (
                  <List shouldShowDividers={true}>
                    {(rows || Array(pageSize).fill(DUMMY_ROW)).map((row: GalleryUserRow, index: number): React.ReactElement => (
                      <List.Item key={`${index}-${row.galleryUser.address}`} itemKey={`${index}-${row.galleryUser.address}`}>
                        <MemberRowContent row={row} index={(pageSize * page) + index} onFollowClicked={onFollowClicked} isFollowing={followedUsers.includes(row.galleryUser.address)} />
                      </List.Item>
                    ))}
                  </List>
                ) : (
                  <StyledTable $theme={tableTheme}>
                    <StyledTableHead>
                      <StyledTableHeadRow>
                        <HeaderCell theme={tableHeaderCellTheme} headerId='INDEX' title='#' isOrderable={false} orderDirection={null} />
                        <HeaderCell theme={tableHeaderCellTheme} headerId='MEMBER' title='Member' isOrderable={false} orderDirection={null} />
                        <HeaderCell theme={tableHeaderCellTheme} headerId='JOINDATE' title='Joined' isOrderable={true} orderDirection={orderField === 'JOINDATE' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                        <HeaderCell theme={tableHeaderCellTheme} headerId='TOKENCOUNT' title='Tokens' isOrderable={true} orderDirection={orderField === 'TOKENCOUNT' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                        <HeaderCell theme={tableHeaderCellTheme} headerId='FOLLOWERCOUNT' title='Followers' isOrderable={true} orderDirection={orderField === 'FOLLOWERCOUNT' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                      </StyledTableHeadRow>
                    </StyledTableHead>
                    <StyledTableBody>
                      {(rows || Array(pageSize).fill(DUMMY_ROW)).map((row: GalleryUserRow, index: number): React.ReactFragment => (
                        <StyledTableBodyRow key={`${index}-${row.galleryUser.address}`}>
                          <StyledTableBodyRowItem $theme={tableCellTheme}>
                            <Text alignment={TextAlignment.Center}>{(pageSize * page) + index}</Text>
                          </StyledTableBodyRowItem>
                          <StyledTableBodyRowItem $theme={tableCellTheme}>
                            <UserCellContent row={row} />
                          </StyledTableBodyRowItem>
                          <StyledTableBodyRowItem $theme={tableCellTheme}>
                            {row.galleryUser.joinDate ? (
                              <Text alignment={TextAlignment.Center}>{dateToRelativeString(row.galleryUser.joinDate)}</Text>
                            ) : (
                              <Text alignment={TextAlignment.Center} variant='note'>{'-'}</Text>
                            )}
                          </StyledTableBodyRowItem>
                          <StyledTableBodyRowItem $theme={tableCellTheme}>
                            <OwnedTokensCellContent row={row} />
                          </StyledTableBodyRowItem>
                          <StyledTableBodyRowItem $theme={tableCellTheme}>
                            {row.galleryUser.twitterProfile != null ? (
                              <Stack direction={Direction.Horizontal} shouldAddGutters={true} childAlignment={Alignment.Fill}>
                                <Text alignment={TextAlignment.Center}>{row.galleryUser.twitterProfile.followerCount}</Text>
                                {followedUsers.includes(row.galleryUser.address) ? (
                                  <Text variant='note'>Following</Text>
                                ) : (
                                  <Button variant='small' text='Follow' onClicked={(): Promise<void> => onFollowClicked(row.galleryUser)} />
                                )}
                              </Stack>
                            ) : (
                              <Text alignment={TextAlignment.Center} variant='note'>{'-'}</Text>
                            )}
                          </StyledTableBodyRowItem>
                        </StyledTableBodyRow>
                      ))}
                    </StyledTableBody>
                  </StyledTable>
                )}
              </Box>
            </Stack.Item>
          </Stack>
        </HidingView>
      </Stack>
      <ColorSettingView variant='dialog'>
        <Dialog
          isOpen={isTokenSubpageShowing}
          onCloseClicked={onCloseSubpageClicked}
          maxWidth='1000px'
          maxHeight='90%'
        >
          <SubRouterOutlet />
        </Dialog>
      </ColorSettingView>
    </React.Fragment>
  );
};
