import React from 'react';
import Sidebar from './Sidebar';
import styled from 'styled-components';

type LayoutProps = { children: React.ReactNode };

const StyledContainer = styled.div`
  display: flex;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <StyledContainer>
      <Sidebar />
      {children}
    </StyledContainer>
  );
};

export default Layout;