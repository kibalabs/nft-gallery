import React from 'react';

import { dateToRelativeString, getClassName } from '@kibalabs/core';
import { SubRouterOutlet, useLocation, useNavigator } from '@kibalabs/core-react';
import { Alignment, Box, ColorSettingView, Dialog, Direction, Head, IconButton, Image, KibaIcon, LinkBase, LoadingSpinner, PaddingSize, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';
import styled from 'styled-components';

import { CollectionToken, GalleryUserRow, ListResponse } from '../../client';
import { AccountViewLink } from '../../components/AccountView';
import { MarginView } from '../../components/MarginView';
import { NumberPager } from '../../components/NumberPager';
import { useGlobals } from '../../globalsContext';
import { getChain } from '../../util';


// interface TableColumn {
//   title: string;
//   isOrderable?: boolean;
//   orderDirection?: 0 | 1 | -1;
// }

interface IStyledTableProps {

}

const StyledTable = styled.table<IStyledTableProps>`
  width: 100%;
  height: 100%;
  border-radius: 1em;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 1);
  overflow-x: auto;
`;

interface IStyledTableHeadProps {

}

const StyledTableHead = styled.thead<IStyledTableHeadProps>`

`;

interface IStyledTableHeadRowProps {

}

const StyledTableHeadRow = styled.tr<IStyledTableHeadRowProps>`
`;

interface IStyledTableHeadRowItemProps {

}

const StyledTableHeadRowItem = styled.td<IStyledTableHeadRowItemProps>`
  padding: 0.5em 1em;
  border-width: 1px 0px;
  border-style: solid;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 1) rgba(255, 255, 255, 0.2);

  &.clickable {
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    &:active {
      background-color: rgba(255, 255, 255, 0.3);
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
  &.clickable {
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    &:active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

interface IStyledTableBodyRowItemProps {
}

const StyledTableBodyRowItem = styled.td<IStyledTableBodyRowItemProps>`
  padding: 0.5em 1em;
  border-width: 1px 0px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.2);
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
    <StyledTableHeadRowItem className={getClassName(props.onClicked != null && 'clickable')} onClick={onClicked}>
      <Stack direction={Direction.Horizontal} isFullWidth={true} contentAlignment={Alignment.Start} childAlignment={Alignment.Center} shouldAddGutters={true}>
        <Text variant='bold' tag='span' alignment={TextAlignment.Left}>{props.title}</Text>
        {props.orderDirection && (
          <KibaIcon variant='small' iconId={props.orderDirection === -1 ? 'ion-caret-down-outline' : 'ion-caret-up-outline'} />
        )}
      </Stack>
    </StyledTableHeadRowItem>
  );
};

export const MembersPage = (): React.ReactElement => {
  const { collection, notdClient, projectId } = useGlobals();
  const navigator = useNavigator();
  const location = useLocation();
  const [order, setOrder] = React.useState<string>('TOKENCOUNT_DESC');
  const [page, setPage] = React.useState<number>(0);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [rows, setRows] = React.useState<GalleryUserRow[] | undefined | null>(undefined);

  const pageSize = 100;
  const [orderField, orderDirection] = order.split('_');
  const isTokenSubpageShowing = location.pathname.includes('/tokens/');

  if (getChain(projectId) !== 'ethereum' || projectId === 'mdtp') {
    return (
      <React.Fragment />
    );
  }

  const updateRows = React.useCallback((): void => {
    setRows(undefined);
    if (!collection) {
      return;
    }
    notdClient.queryCollectionUsers(collection.address, pageSize, pageSize * page, order).then((retrievedGalleryUserRows: ListResponse<GalleryUserRow>): void => {
      setRows(retrievedGalleryUserRows.items);
      setPageCount(Math.ceil(retrievedGalleryUserRows.totalCount / pageSize));
    }).catch((error: unknown): void => {
      console.error(error);
      setRows(null);
    });
  }, [collection, notdClient, order, page, pageSize]);

  React.useEffect((): void => {
    updateRows();
  }, [updateRows]);

  const onHeaderClicked = (headerId: string): void => {
    if (headerId !== orderField) {
      setOrder(`${headerId}_DESC`);
    } else if (orderDirection === 'DESC') {
      setOrder(`${headerId}_ASC`);
    } else {
      setOrder('TOKENCOUNT_DESC');
    }
  };

  const onCloseSubpageClicked = (): void => {
    navigator.navigateTo('/members');
  };

  const onPageClicked = (newPage: number): void => {
    setPage(newPage);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Members | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      {collection === undefined || rows === undefined ? (
        <LoadingSpinner />
      ) : collection === null || rows === null ? (
        <Text variant='error'>Failed to load</Text>
      ) : (
        <Stack direction={Direction.Vertical} isFullHeight={true} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} paddingHorizontal={PaddingSize.Wide} paddingVertical={PaddingSize.Default}>
          <Stack.Item alignment={Alignment.End}>
            <Box maxWidth={'400px'}>
              <NumberPager
                pageCount={pageCount}
                activePage={page}
                siblingPageCount={1}
                onPageClicked={onPageClicked}
              />
            </Box>
          </Stack.Item>
          <Stack.Item growthFactor={1} shrinkFactor={1}>
            <Box variant='bordered-unpadded' isScrollableVertically={true}>
              <StyledTable>
                <StyledTableHead>
                  <StyledTableHeadRow>
                    <HeaderCell headerId='INDEX' title='#' isOrderable={false} orderDirection={null} />
                    <HeaderCell headerId='MEMBER' title='Member' isOrderable={false} orderDirection={null} />
                    <HeaderCell headerId='JOINDATE' title='Joined' isOrderable={true} orderDirection={orderField === 'JOINDATE' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                    <HeaderCell headerId='TOKENCOUNT' title='Tokens' isOrderable={true} orderDirection={orderField === 'TOKENCOUNT' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                    <HeaderCell headerId='FOLLOWERCOUNT' title='# Followers' isOrderable={true} orderDirection={orderField === 'FOLLOWERCOUNT' ? (orderDirection === 'DESC' ? -1 : 1) : null} onClicked={onHeaderClicked} />
                  </StyledTableHeadRow>
                </StyledTableHead>
                <StyledTableBody>
                  {rows.map((row: GalleryUserRow, index: number): React.ReactFragment => (
                    <StyledTableBodyRow key={index}>
                      <StyledTableBodyRowItem>
                        <Text alignment={TextAlignment.Center}>{(pageSize * page) + index}</Text>
                      </StyledTableBodyRowItem>
                      <StyledTableBodyRowItem><UserCellContent row={row} /></StyledTableBodyRowItem>
                      <StyledTableBodyRowItem>
                        {row.galleryUser.joinDate ? (
                          <Text alignment={TextAlignment.Center}>{dateToRelativeString(row.galleryUser.joinDate)}</Text>
                        ) : (
                          <Text alignment={TextAlignment.Center} variant={'note'}>{'-'}</Text>
                        )}
                      </StyledTableBodyRowItem>
                      <StyledTableBodyRowItem><OwnedTokensCellContent row={row} /></StyledTableBodyRowItem>
                      <StyledTableBodyRowItem>
                        {row.galleryUser.twitterProfile ? (
                          <Text alignment={TextAlignment.Center}>{row.galleryUser.twitterProfile.followerCount}</Text>
                        ) : (
                          <Text alignment={TextAlignment.Center} variant={'note'}>{'-'}</Text>
                        )}
                      </StyledTableBodyRowItem>
                    </StyledTableBodyRow>
                  ))}
                </StyledTableBody>
              </StyledTable>
            </Box>
          </Stack.Item>
        </Stack>
      )}
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
