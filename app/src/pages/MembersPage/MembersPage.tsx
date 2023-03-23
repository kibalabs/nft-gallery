import React from 'react';

import { dateToRelativeString, dateToString, RecursivePartial } from '@kibalabs/core';
import { SubRouterOutlet, useIntegerUrlQueryState, useLocation, useNavigator, useUrlQueryState } from '@kibalabs/core-react';
import { Alignment, Box, Button, ColorSettingView, ContainingView, Dialog, Direction, Head, IconButton, KibaIcon, LinkBase, List, LoadingSpinner, OptionSelect, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, Text, TextAlignment, useColors, useResponsiveScreenSize } from '@kibalabs/ui-react';
import { useWeb3Account, useWeb3LoginSignature, useWeb3OnLoginClicked } from '@kibalabs/web3-react';
import ReactTooltip from 'react-tooltip';

import { Collection, CollectionToken, GallerySuperCollectionUserRow, GalleryUser, GalleryUserBadge, GalleryUserRow, ListResponse } from '../../client';
import { AccountViewLink } from '../../components/AccountView';
import { IpfsImage } from '../../components/IpfsImage';
import { MarginView } from '../../components/MarginView';
import { NumberPager } from '../../components/NumberPager';
import { Table } from '../../components/Table';
import { ITableCellTheme, TableCell } from '../../components/TableCell';
import { TableRow } from '../../components/TableRow';
import { useGlobals } from '../../globalsContext';
import { getBadges, getChain, getCollectionAddress, getDefaultMembersSort, getProjectConfig, IBadge, isBadgesEnabled, isSuperCollection } from '../../util';


interface IUserCellContentProps {
  userAddress: string;
  twitterUsername: string | null;
}

const UserCellContent = (props: IUserCellContentProps): React.ReactElement => {
  return (
    <Stack direction={Direction.Horizontal} isFullWidth={false} isFullHeight={true} contentAlignment={Alignment.Start} childAlignment={Alignment.Center} shouldAddGutters={true}>
      <AccountViewLink address={props.userAddress} target={`/members/${props.userAddress}`} />
      {props.twitterUsername && (
        <IconButton variant='small' icon={<KibaIcon variant='small' iconId='ion-logo-twitter' /> } target={`https://twitter.com/${props.twitterUsername}`} />
      )}
    </Stack>
  );
};

interface IJoinedCellContentProps {
  userAddress: string;
  joinDate: Date | null;
  // row: GalleryUserRow;
}

const JoinedCellContent = (props: IJoinedCellContentProps): React.ReactElement => {
  const colors = useColors();

  return (
    <React.Fragment>
      <div data-tip data-for={`joinedcell-${props.userAddress}`}>
        {props.joinDate ? (
          <Text alignment={TextAlignment.Center}>{dateToRelativeString(props.joinDate)}</Text>
        ) : (
          <Text alignment={TextAlignment.Center} variant='note'>{'-'}</Text>
        )}
      </div>
      <ReactTooltip id={`joinedcell-${props.userAddress}`} effect='solid' backgroundColor={colors.backgroundLight10} border={true} borderColor={colors.backgroundDark10}>
        <Box maxWidth='300px'>
          <Stack direction={Direction.Vertical} shouldAddGutters={true}>
            {props.joinDate ? (
              <Text>{`Joined on ${dateToString(props.joinDate, 'yyyy-MM-dd HH:mm')}`}</Text>
            ) : (
              <Text>Never joined</Text>
            )}
          </Stack>
        </Box>
      </ReactTooltip>
    </React.Fragment>
  );
};

interface IOwnedTokensCellContentProps {
  ownedTokenCount: number;
  chosenOwnedTokens: CollectionToken[];
  shouldHideTokens?: boolean;
  maxTokenCount?: number;
}

const OwnedTokensCellContent = (props: IOwnedTokensCellContentProps): React.ReactElement => {
  const maxTokenCount = props.maxTokenCount ?? 5;
  return (
    <Stack direction={Direction.Horizontal} isFullWidth={false} contentAlignment={Alignment.Start} shouldAddGutters={true}>
      <Text alignment={TextAlignment.Center}>{props.ownedTokenCount}</Text>
      <Spacing variant={PaddingSize.Default} />
      {!props.shouldHideTokens && (
        <React.Fragment>
          {props.chosenOwnedTokens.slice(0, maxTokenCount).map((token: CollectionToken): React.ReactElement => (
            <MarginView key={token.tokenId} marginLeft='inverseWide'>
              <LinkBase target={`/members/tokens/${token.tokenId}`}>
                <Box variant='memberToken' isFullWidth={false} shouldClipContent={true}>
                  <IpfsImage variant='unrounded' isLazyLoadable={true} source={(token.resizableImageUrl ?? token.imageUrl ?? '')} alternativeText={token.name} width='1.4em' height='1.4em' />
                </Box>
              </LinkBase>
            </MarginView>
          ))}
        </React.Fragment>
      )}
    </Stack>
  );
};

interface IBadgesCellContentProps {
  userAddress: string;
  projectId: string;
  maxBadgeCount?: number;
  galleryUserBadges: GalleryUserBadge[];
  // row: GalleryUserRow;
}

const BadgesCellContent = (props: IBadgesCellContentProps): React.ReactElement => {
  const colors = useColors();
  const maxBadgeCount = props.maxBadgeCount ?? 5;
  const badges = React.useMemo((): IBadge[] => {
    const userBadgeKeys = props.galleryUserBadges.map((badge: GalleryUserBadge): string => badge.badgeKey);
    return getBadges(props.projectId).filter((badge: IBadge): boolean => userBadgeKeys.includes(badge.key));
  }, [props.projectId, props.galleryUserBadges]);

  return (
    <Stack direction={Direction.Horizontal} isFullWidth={false} contentAlignment={Alignment.Start} shouldAddGutters={true}>
      <Text alignment={TextAlignment.Center}>{badges.length}</Text>
      <Spacing variant={PaddingSize.Default} />
      <React.Fragment>
        {badges.slice(0, maxBadgeCount).map((badge: IBadge): React.ReactElement => (
          <React.Fragment key={badge.key}>
            <div data-tip data-for={`${props.userAddress}-${badge.key}`}>
              <MarginView marginLeft='inverseWide'>
                <Box variant='memberToken' isFullWidth={false} shouldClipContent={true}>
                  <IpfsImage variant='unrounded' isLazyLoadable={true} source={badge.imageUrl} alternativeText={badge.name} width='1.4em' height='1.4em' />
                </Box>
              </MarginView>
            </div>
            <ReactTooltip id={`${props.userAddress}-${badge.key}`} effect='solid' backgroundColor={colors.backgroundLight10} border={true} borderColor={colors.backgroundDark10}>
              <Box maxWidth='300px'>
                <Stack direction={Direction.Vertical} shouldAddGutters={true}>
                  <Text variant='bold'>{badge.name}</Text>
                  <Text>{badge.description}</Text>
                </Stack>
              </Box>
            </ReactTooltip>
          </React.Fragment>
        ))}
      </React.Fragment>
    </Stack>
  );
};

interface IHeaderCellProps {
  id?: string;
  className?: string;
  headerId: string;
  title: string;
  isOrderable?: boolean;
  orderDirection?: -1 | 1 | null;
  theme?: RecursivePartial<ITableCellTheme>;
  onClicked?: (headerId: string) => void;
}

const HeaderCell = (props: IHeaderCellProps): React.ReactElement => {
  const colors = useColors();
  if (props.isOrderable && !props.onClicked) {
    throw Error('onClicked must be provided if isOrderable=true');
  }

  return (
    <TableCell
      id={props.id}
      className={props.className}
      theme={props.theme}
      variant='header'
      headerId={props.headerId}
      onClicked={props.onClicked}
    >
      <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignment={Alignment.Start} childAlignment={Alignment.Center} shouldAddGutters={true}>
        <Text variant='bold' tag='span' alignment={TextAlignment.Left}>{props.title}</Text>
        {props.orderDirection ? (
          <KibaIcon variant='small' iconId={props.orderDirection === -1 ? 'ion-caret-down' : 'ion-caret-up'} />
        ) : props.isOrderable && (
          <KibaIcon variant='small' iconId={'ion-caret-forward'} _color={colors.textClear75} />
        )}
      </Stack>
    </TableCell>
  );
};

interface IMemberRowContentProps {
  index: number;
  row: GallerySuperCollectionUserRow;
  projectId: string;
  isFollowing: boolean;
  collection: Collection;
  onFollowClicked: (galleryUser: GalleryUser) => void;
}

const MemberRowContent = (props: IMemberRowContentProps): React.ReactElement => {
  const collectionAddress = getCollectionAddress(props.projectId) as string;

  const badges = React.useMemo((): IBadge[] => {
    const userBadgeKeys = props.row.galleryUserBadges.map((badge: GalleryUserBadge): string => badge.badgeKey);
    return getBadges(props.projectId).filter((badge: IBadge): boolean => userBadgeKeys.includes(badge.key));
  }, [props.projectId, props.row.galleryUserBadges]);

  const onFollowClicked = (): void => {
    props.onFollowClicked(props.row.galleryUser);
  };

  // NOTE(krishan711): this is here because of creepz
  const allOwnedCount = Object.keys(props.row.ownedTokenCountMap).reduce((accumulator: number, current: string): number => {
    return accumulator + (props.row.ownedTokenCountMap[current] || 0);
  }, 0);
  const allChosenTokens = Object.keys(props.row.ownedTokenCountMap).reduce((accumulator: CollectionToken[], current: string): CollectionToken[] => {
    return [...accumulator, ...(props.row.chosenOwnedTokensMap[current] || [])];
  }, []);

  return (
    <Stack direction={Direction.Vertical} isFullWidth={true} contentAlignment={Alignment.Start} shouldAddGutters={true}>
      <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignment={Alignment.Start} shouldAddGutters={true}>
        <Text>{`#${props.index}`}</Text>
        <Stack.Item growthFactor={1} shrinkFactor={1}>
          <Stack direction={Direction.Vertical} contentAlignment={Alignment.Start}>
            <AccountViewLink address={props.row.galleryUser.address} target={`/members/${props.row.galleryUser.address}`} />
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
              <Text>{allOwnedCount}</Text>
              {props.collection.doesSupportErc1155 && (
                <React.Fragment>
                  <Spacing variant={PaddingSize.Narrow} />
                  <Text>{`(${props.row.uniqueOwnedTokenCountMap[collectionAddress] || 0})`}</Text>
                </React.Fragment>
              )}
              <Spacing variant={PaddingSize.Narrow} />
              {allChosenTokens.length > 0 && (
                <LinkBase target={`/members/tokens/${allChosenTokens[0].tokenId}`}>
                  <Box variant='memberToken-unbordered' isFullWidth={false} shouldClipContent={true}>
                    <IpfsImage variant='unrounded' isLazyLoadable={true} source={allChosenTokens[0].resizableImageUrl ?? allChosenTokens[0].imageUrl ?? ''} alternativeText={allChosenTokens[0].name} width='1.4em' height='1.4em' />
                  </Box>
                </LinkBase>
              )}
            </Stack>
            {props.row.galleryUser.twitterProfile && (
              <React.Fragment>
                <Stack direction={Direction.Horizontal} contentAlignment={Alignment.End} childAlignment={Alignment.Center}>
                  <IconButton variant='small' icon={<KibaIcon variant='small' iconId='ion-logo-twitter' /> } target={`https://twitter.com/${props.row.galleryUser.twitterProfile.username}`} />
                  <Text>{props.row.galleryUser.twitterProfile.followerCount}</Text>
                  {props.isFollowing ? (
                    <Text variant='note' shouldBreakAnywhere={false} shouldBreakOnWords={false}>Following</Text>
                  ) : (
                    <Button variant='small' text='Follow' onClicked={onFollowClicked} />
                  )}
                </Stack>
              </React.Fragment>
            )}
          </Stack>
        </Box>
      </Stack>
      <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignment={Alignment.Start} shouldAddGutters={true} shouldWrapItems={true}>
        {badges.slice(0, 100).map((badge: IBadge): React.ReactElement => (
          <Box key={badge.key} isFullWidth={false} variant='memberToken' shouldClipContent={true}>
            <IpfsImage variant='unrounded' isLazyLoadable={true} source={badge.imageUrl} alternativeText={badge.name} width='1.4em' height='1.4em' />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export const MembersPage = (): React.ReactElement => {
  const { projectId } = useGlobals();

  if (getChain(projectId) !== 'ethereum') {
    return (
      <React.Fragment />
    );
  }

  return <MembersPageReal />;
};

export const DEFAULT_SORT = 'FOLLOWERCOUNT_DESC';

export const MembersPageReal = (): React.ReactElement => {
  const screenSize = useResponsiveScreenSize();
  // const tableTheme = useBuiltTheme<ITableTheme>('tables');
  // const tableHeaderCellTheme = useBuiltTheme<ITableCellTheme>('tableCells', 'header');
  // const tableCellTheme = useBuiltTheme<ITableCellTheme>('tableCells');
  const { collection, notdClient, projectId } = useGlobals();
  const defaultMembersSort = getDefaultMembersSort(projectId) || DEFAULT_SORT;
  const navigator = useNavigator();
  const location = useLocation();
  const account = useWeb3Account();
  const loginSignature = useWeb3LoginSignature();
  const onLoginClicked = useWeb3OnLoginClicked();
  const [followedUsers, setFollowedUsers] = React.useState<string[]>([]);
  const [queryOrder, setOrder] = useUrlQueryState('order', undefined, defaultMembersSort);
  const [queryPage, setPage] = useIntegerUrlQueryState('page', undefined);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [rows, setRows] = React.useState<GallerySuperCollectionUserRow[] | undefined | null>(undefined);

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
    if (isSuperCollection(projectId)) {
      notdClient.querySuperCollectionUsers(projectId, pageSize, pageSize * page, `${collection.address}_${order}`).then((retrievedGalleryUserRows: ListResponse<GallerySuperCollectionUserRow>): void => {
        // setRows(retrievedGalleryUserRows.items.map((row: GallerySuperCollectionUserRow): GalleryUserRow => {
        //   const convertedRow = new GalleryUserRow(
        //     row.galleryUser,
        //     row.ownedTokenCountMap[collection.address] || 0,
        //     row.uniqueOwnedTokenCountMap[collection.address] || 0,
        //     row.chosenOwnedTokensMap[collection.address] || [],
        //     row.galleryUserBadges,
        //   );
        //   console.log('convertedRow', convertedRow);
        //   return convertedRow;
        // }));
        setRows(retrievedGalleryUserRows.items);
        setPageCount(Math.ceil(retrievedGalleryUserRows.totalCount / pageSize));
      }).catch((error: unknown): void => {
        console.error(error);
        setRows(null);
      });
    } else {
      notdClient.queryCollectionUsers(collection.address, pageSize, pageSize * page, order).then((retrievedGalleryUserRows: ListResponse<GalleryUserRow>): void => {
        // setRows(retrievedGalleryUserRows.items);
        setRows(retrievedGalleryUserRows.items.map((row: GalleryUserRow): GallerySuperCollectionUserRow => {
          const convertedRow = new GallerySuperCollectionUserRow(
            row.galleryUser,
            {[collection.address]: row.ownedTokenCount},
            {[collection.address]: row.uniqueOwnedTokenCount},
            {[collection.address]: row.chosenOwnedTokens},
            row.galleryUserBadges,
          );
          return convertedRow;
        }));
        setPageCount(Math.ceil(retrievedGalleryUserRows.totalCount / pageSize));
      }).catch((error: unknown): void => {
        console.error(error);
        setRows(null);
      });
    }
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

  const projectConfig = getProjectConfig(projectId);
  const columns: IHeaderCellProps[] = React.useMemo((): IHeaderCellProps[] => {
    return [
      {headerId: 'INDEX', title: '#', isOrderable: false},
      {headerId: 'MEMBER', title: 'Member', isOrderable: false},
      {headerId: 'JOINDATE', title: 'Joined', isOrderable: true},
      ...(projectId === 'creepz' ? [
        {headerId: 'TOKENCOUNT', title: 'Creepz', isOrderable: true},
        {headerId: 'OTHERTOKENCOUNT', title: 'Army', isOrderable: false},
      ] : [
        {headerId: 'TOKENCOUNT', title: 'Tokens', isOrderable: true},
      ]),
      ...(collection?.doesSupportErc1155 ? [
        {headerId: 'UNIQUETOKENCOUNT', title: 'Unique', isOrderable: true},
      ] : []),
      ...(projectConfig.isBadgesEnabled ? [
        {headerId: 'BADGES', title: 'Badges', isOrderable: false}
      ] : []),
      {headerId: 'FOLLOWERCOUNT', title: 'Followers', isOrderable: true},
    ];
  }, [projectConfig, isBadgesEnabled, orderField, orderDirection]);

  const getRowElement = (row: GallerySuperCollectionUserRow, index: number): React.ReactElement => {
    if (!collection?.address) {
      return (
        <React.Fragment></React.Fragment>
      );
    }
    // NOTE(krishan711): this is creepz sepcific
    const primaryOwnedCount = row.ownedTokenCountMap[collection.address] || 0;
    const secondaryOwnedCount = Object.keys(row.ownedTokenCountMap).reduce((accumulator: number, current: string): number => {
      if (current === collection.address) {
        return accumulator;
      }
      return accumulator + (row.ownedTokenCountMap[current] || 0);
    }, 0);
    const secondaryChosenTokens = Object.keys(row.ownedTokenCountMap).reduce((accumulator: CollectionToken[], current: string): CollectionToken[] => {
      if (current === collection.address) {
        return accumulator;
      }
      return [...accumulator, ...(row.chosenOwnedTokensMap[current] || [])];
    }, []);
    return (
      <React.Fragment>
        <TableCell>
          <Text alignment={TextAlignment.Center}>{(pageSize * page) + index + 1}</Text>
        </TableCell>
        <TableCell>
          <UserCellContent userAddress={row.galleryUser.address} twitterUsername={row.galleryUser.twitterProfile?.username || null} />
        </TableCell>
        <TableCell>
          <JoinedCellContent userAddress={row.galleryUser.address} joinDate={row.galleryUser.joinDate} />
        </TableCell>
        {projectId === 'creepz' ? (
          <React.Fragment>
            <TableCell>
              <OwnedTokensCellContent ownedTokenCount={primaryOwnedCount} chosenOwnedTokens={row.chosenOwnedTokensMap[collection.address] || []} maxTokenCount={3} />
            </TableCell>
            <TableCell>
              <OwnedTokensCellContent ownedTokenCount={secondaryOwnedCount} chosenOwnedTokens={secondaryChosenTokens} maxTokenCount={3} />
            </TableCell>
          </React.Fragment>
        ) : (
          <TableCell>
            <OwnedTokensCellContent ownedTokenCount={row.ownedTokenCountMap[collection.address] || 0} chosenOwnedTokens={row.chosenOwnedTokensMap[collection.address] || []} maxTokenCount={3} />
          </TableCell>
        )}
        {collection?.doesSupportErc1155 && (
          <TableCell>
            <Text alignment={TextAlignment.Center}>{row.uniqueOwnedTokenCountMap[collection.address]}</Text>
          </TableCell>
        )}
        {isBadgesEnabled(projectId) && (
          <TableCell>
            <BadgesCellContent projectId={projectId} userAddress={row.galleryUser.address} galleryUserBadges={row.galleryUserBadges} />
          </TableCell>
        )}
        <TableCell>
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
        </TableCell>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Head>
        <title>{`Members | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <ContainingView>
        <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
          {collection === undefined || rows === undefined ? (
            <LoadingSpinner />
          ) : collection === null || rows === null ? (
            <Text variant='error'>Failed to load</Text>
          ) : (
            <React.Fragment>
              <Stack direction={Direction.Horizontal} isFullWidth={true} childAlignment={Alignment.Center}>
                <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                  <Box maxWidth='50%'>
                    <OptionSelect
                      selectedItemKey={order}
                      onItemClicked={onOrderSelected}
                      inputWrapperVariant='smallPadding'
                      options={[
                        { itemKey: 'TOKENCOUNT_DESC', text: '↓ Owned' },
                        { itemKey: 'TOKENCOUNT_ASC', text: '↑ Owned' },
                        { itemKey: 'UNIQUETOKENCOUNT_DESC', text: '↓ Unique' },
                        { itemKey: 'UNIQUETOKENCOUNT_ASC', text: '↑ Unique' },
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
              <Stack.Item growthFactor={1} shrinkFactor={1} isHidden={rows == null}>
                <Box variant='borderedLight-unpadded' isScrollableVertically={true}>
                  {screenSize === ScreenSize.Base || screenSize === ScreenSize.Small ? (
                    <List shouldShowDividers={true}>
                      {(rows || Array(pageSize).fill(DUMMY_ROW)).map((row: GallerySuperCollectionUserRow, index: number): React.ReactElement => (
                        <List.Item key={`${index}-${row.galleryUser.address}`} itemKey={`${index}-${row.galleryUser.address}`}>
                          <MemberRowContent projectId={projectId} row={row} collection={collection} index={(pageSize * page) + index + 1} onFollowClicked={onFollowClicked} isFollowing={followedUsers.includes(row.galleryUser.address)} />
                        </List.Item>
                      ))}
                    </List>
                  ) : (
                    <Table>
                      <thead>
                        <TableRow>
                          {columns.map((column: IHeaderCellProps): React.ReactElement => (
                            <HeaderCell
                              key={column.headerId}
                              headerId={column.headerId}
                              title={column.title}
                              isOrderable={column.isOrderable}
                              orderDirection={column.isOrderable ? (orderField === column.headerId ? (orderDirection === 'DESC' ? -1 : 1) : null) : undefined}
                              onClicked={onHeaderClicked}
                            />
                          ))}
                          {/* <HeaderCell headerId='INDEX' title='#' isOrderable={false} orderDirection={null} />
                          <HeaderCell headerId='MEMBER' title='Member' isOrderable={false} orderDirection={null} />
                          <HeaderCell headerId='JOINDATE' title='Joined' isOrderable={true} orderDirection={orderField === 'JOINDATE' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                          <HeaderCell headerId='TOKENCOUNT' title='Tokens' isOrderable={true} orderDirection={orderField === 'TOKENCOUNT' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                          {collection.doesSupportErc1155 && (
                            <HeaderCell headerId='UNIQUETOKENCOUNT' title='Unique' isOrderable={true} orderDirection={orderField === 'UNIQUETOKENCOUNT' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                          )}
                          {isBadgesEnabled(projectId) && (
                            <HeaderCell headerId='BADGES' title='Badges' isOrderable={false} orderDirection={null} />
                          )}
                          <HeaderCell headerId='FOLLOWERCOUNT' title='Followers' isOrderable={true} orderDirection={orderField === 'FOLLOWERCOUNT' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} /> */}
                        </TableRow>
                      </thead>
                      <tbody>
                      {(rows || []).map((row: GallerySuperCollectionUserRow, index: number): React.ReactElement => (
                        <TableRow key={`${index}-${row.galleryUser.address}`} theme={{ normal: { default: { background: { 'background-color': (pageSize * page) + index + 1 <= 10 ? `rgba(255, 209, 5, ${0.25 * (1 - (((pageSize * page) + index + 1) / 10.0))})` : undefined } } } }}>
                          {getRowElement(row, index)}
                        </TableRow>
                      ))}
                      </tbody>
                    </Table>
                  )}
                </Box>
              </Stack.Item>
            </React.Fragment>
          )}
        </Stack>
      </ContainingView>
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
