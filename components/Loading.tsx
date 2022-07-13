import styled from "styled-components";
import Image from "next/image";
import ChatAppLogo from "../assets/next-logo.png";
import CircularProgress from "@mui/material/CircularProgress";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

const Loading = () => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image
          src={ChatAppLogo}
          alt="ChatApp Logo"
          height="100px"
          width="200px"
        />
      </StyledImageWrapper>
      <CircularProgress />
    </StyledContainer>
  );
};

export default Loading;
