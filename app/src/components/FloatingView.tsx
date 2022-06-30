import React from 'react';

import { IMultiAnyChildProps } from '@kibalabs/core-react';
import styled from 'styled-components';

interface IStyledFloatingViewProps {
}

interface IFloatingViewProps extends IMultiAnyChildProps {
}

const StyledFloatingView = styled.div<IStyledFloatingViewProps>`
  position: fixed;
  bottom: 20px;
  right: 20px;
`;

export const FloatingView = (props: IFloatingViewProps): React.ReactElement => {
  return (
    <StyledFloatingView>
      {props.children}
    </StyledFloatingView>
  );
};
