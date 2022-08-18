import React from 'react';

import { Alignment, Direction, Head, Spacing, Stack } from '@kibalabs/ui-react';

import { useGlobals } from '../../globalsContext';

export const MembersPage = (): React.ReactElement => {
  const { collection } = useGlobals();

  return (
    <React.Fragment>
      <Head>
        <title>{`Members | ${collection ? collection.name : 'Token'} Gallery`}</title>
      </Head>
      <Stack direction={Direction.Vertical} isFullHeight={false} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
        <Spacing />
      </Stack>
    </React.Fragment>
  );
};
