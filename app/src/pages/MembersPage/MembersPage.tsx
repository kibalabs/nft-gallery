import React from 'react';

import { dateToRelativeString } from '@kibalabs/core';
import { Alignment, Box, Direction, Head, IconButton, Image, KibaIcon, LoadingSpinner, PaddingSize, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';
import styled from 'styled-components';

import { CollectionToken, GalleryUserRow } from '../../client';
import { AccountView } from '../../components/AccountView';
import { MarginView } from '../../components/MarginView';
import { useGlobals } from '../../globalsContext';


// interface TableColumn {
//   title: string;
//   isSortable?: boolean;
//   sortDirection?: 0 | 1 | -1;
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
  background-color: rgba(255, 255, 255, 0.1);
  position: sticky;
`;

interface IStyledTableHeadRowProps {

}

const StyledTableHeadRow = styled.tr<IStyledTableHeadRowProps>`
`;

interface IStyledTableHeadRowItemProps {

}

const StyledTableHeadRowItem = styled.td<IStyledTableHeadRowItemProps>`
  padding: 0.5em 1em;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 1) rgba(255, 255, 255, 0.2);
`;

interface IStyledTableBodyProps {

}

const StyledTableBody = styled.tbody<IStyledTableBodyProps>`
`;

interface IStyledTableBodyRowProps {

}

const StyledTableBodyRow = styled.tr<IStyledTableBodyRowProps>`
`;

interface IStyledTableBodyRowItemProps {
}

const StyledTableBodyRowItem = styled.td<IStyledTableBodyRowItemProps>`
  padding: 0.5em 1em;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.2);
`;

interface IUserCellProps {
  row: GalleryUserRow;
}

const UserCell = (props: IUserCellProps): React.ReactElement => {
  return (
    <Stack direction={Direction.Horizontal} isFullWidth={false} contentAlignment={Alignment.Start} shouldAddGutters={true}>
      <AccountView address={props.row.galleryUser.address} />
      {props.row.galleryUser.twitterProfile && (
        <IconButton variant='small' icon={<KibaIcon variant='small' iconId='ion-logo-twitter' /> } target={`https://twitter.com/${props.row.galleryUser.twitterProfile.username}`} />
      )}
    </Stack>
  );
};

interface IOwnedTokensCellProps {
  row: GalleryUserRow;
}

const OwnedTokensCell = (props: IOwnedTokensCellProps): React.ReactElement => {
  return (
    <Stack direction={Direction.Horizontal} isFullWidth={false} contentAlignment={Alignment.Start} shouldAddGutters={true}>
      <Text alignment={TextAlignment.Center}>{props.row.galleryUser.ownedTokenCount}</Text>
      <Spacing variant={PaddingSize.Wide} />
      <React.Fragment>
        {props.row.chosenOwnedTokens.slice(0, 7).map((token: CollectionToken): React.ReactElement => (
          <MarginView key={token.tokenId} marginLeft='inverseWide'>
            <Box width='1.5em' height='1.5em'>
              <Image source={token.resizableImageUrl ?? token.imageUrl ?? ''} alternativeText={token.name} />
            </Box>
          </MarginView>
        ))}
      </React.Fragment>
    </Stack>
  );
};

export const MembersPage = (): React.ReactElement => {
  const { collection, notdClient } = useGlobals();
  const [rows, setRows] = React.useState<GalleryUserRow[] | undefined | null>(undefined);

  // const columns = React.useMemo((): TableColumn[] => {
  //   return [
  //     { title: '#', isSortable: true },
  //     { title: 'Member', isSortable: false },
  //     { title: 'Joined', isSortable: true },
  //     { title: 'Tokens', isSortable: true },
  //     { title: '# Followers', isSortable: true },
  //   ];
  // }, []);

  // const rows = React.useMemo((): GalleryUserRow[] => {
  //   return !collection ? [] : [
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d031', collection.address, null, null, 123, new Date(2022, 2, 1)), [new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, [])]),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d032', collection.address, null, new TwitterProfile('123456', 'krishan711', '', '', false, null, 1234, 1024, 2209), 45, new Date(2022, 7, 10)), [new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, [])]),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d033', collection.address, null, null, 123, new Date(2022, 2, 1)), [new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, [])]),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d034', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d035', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d036', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d031', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d032', collection.address, null, new TwitterProfile('123456', 'krishan711', '', '', false, null, 1234, 1024, 2209), 45, new Date(2022, 7, 10)), [new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, [])]),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d033', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d034', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d035', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d036', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d031', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d032', collection.address, null, new TwitterProfile('123456', 'krishan711', '', '', false, null, 1234, 1024, 2209), 45, new Date(2022, 7, 10)), [new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "207", "", "https://spriteclub.infura-ipfs.io/ipfs/QmW77gbh5BDv661WoX53XVBkwBX1mrcEnDbHDTUb1DxtSX", null, null, null, []), new CollectionToken("0x2744fE5e7776BCA0AF1CDEAF3bA3d1F5cae515d3", "208", "", "https://spriteclub.infura-ipfs.io/ipfs/QmUn162TXwSUKeNXNt6EB48Q1FSREaxSbTi5f1SdQtQ3qs", null, null, null, [])]),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d033', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d034', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d035', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //     new GalleryUserRow(new GalleryUser('0x18090cDA49B21dEAffC21b4F886aed3eB787d036', collection.address, null, null, 123, new Date(2022, 2, 1)), []),
  //   ];
  // }, [collection]);

  const updateRows = React.useCallback((): void => {
    if (!collection) {
      setRows(undefined);
      return;
    }
    notdClient.queryCollectionUsers(collection.address, 50, 0, 'TOKENCOUNT_DESC').then((retrievedGalleryUserRows: GalleryUserRow[]): void => {
      setRows(retrievedGalleryUserRows);
    }).catch((error: unknown): void => {
      console.error(error);
      setRows(null);
    });
  }, [collection, notdClient]);

  React.useEffect((): void => {
    updateRows();
  }, [updateRows]);

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
          <Stack.Item growthFactor={1} shrinkFactor={1}>
            <Box variant='bordered-unpadded' isScrollableVertically={true}>
              <StyledTable>
                <StyledTableHead>
                  <StyledTableHeadRow>
                    <StyledTableHeadRowItem style={{ maxWidth: '4em' }}><Text variant='bold' tag='span' alignment={TextAlignment.Center}>#</Text></StyledTableHeadRowItem>
                    <StyledTableHeadRowItem><Text variant='bold' tag='span' alignment={TextAlignment.Left}>Member</Text></StyledTableHeadRowItem>
                    <StyledTableHeadRowItem><Text variant='bold' tag='span' alignment={TextAlignment.Center}>Joined</Text></StyledTableHeadRowItem>
                    <StyledTableHeadRowItem><Text variant='bold' tag='span' alignment={TextAlignment.Center}>Tokens</Text></StyledTableHeadRowItem>
                    <StyledTableHeadRowItem><Text variant='bold' tag='span' alignment={TextAlignment.Center}># Followers</Text></StyledTableHeadRowItem>
                  </StyledTableHeadRow>
                </StyledTableHead>
                <StyledTableBody>
                  {rows.map((row: GalleryUserRow, index: number): React.ReactFragment => (
                    <StyledTableBodyRow key={index}>
                      <StyledTableBodyRowItem style={{ maxWidth: '4em' }}>
                        <Text alignment={TextAlignment.Center}>{index}</Text>
                      </StyledTableBodyRowItem>
                      <StyledTableBodyRowItem><UserCell row={row} /></StyledTableBodyRowItem>
                      <StyledTableBodyRowItem>
                        {row.galleryUser.joinDate ? (
                          <Text alignment={TextAlignment.Center}>{dateToRelativeString(row.galleryUser.joinDate)}</Text>
                        ) : (
                          <Text alignment={TextAlignment.Center} variant={'note'}>{'-'}</Text>
                        )}
                      </StyledTableBodyRowItem>
                      <StyledTableBodyRowItem><OwnedTokensCell row={row} /></StyledTableBodyRowItem>
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
    </React.Fragment>
  );
};
