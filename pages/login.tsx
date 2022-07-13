import Button from "@mui/material/Button";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import ChatAppLogo from "../assets/next-logo.png";

const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`;

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

const Login = () => {
  return (
    <StyledContainer>
      <Head>Login</Head>
      <StyledLoginContainer>
        <StyledImageWrapper>
          <Image
            src={ChatAppLogo}
            alt="ChatApp Logo"
            height="100px"
            width="200px"
          />
        </StyledImageWrapper>
        <Button
          variant="outlined"
          onClick={() => {
            console.log("Sign in with Google");
          }}
        >
          Sign in with Google
        </Button>
      </StyledLoginContainer>
    </StyledContainer>
  );
};

export default Login;
