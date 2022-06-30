import React from 'react';

import { ITheme } from '@kibalabs/ui-react';
import styled from 'styled-components';

import { Footer } from './FooterView';

interface IStyledFloatingViewProps {
  theme: ITheme;
}

const StyledFloatingView = styled.div<IStyledFloatingViewProps>`
    position: fixed;
    bottom: 20px;
    right: 20px;
  `;
export const FloatingView = (): React.ReactElement => {
  return (
    <StyledFloatingView>
      <Footer />
    </StyledFloatingView>
  );
};
