import React from "react";
import styled, { ThemeProvider } from "styled-components";
import useThemeStore from "../store/themeStore"; // Adjust the import path as needed

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.background};
  transition: background-color 0.3s ease;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${(props) => props.theme.spinnerSecondary};
  border-top: 5px solid ${(props) => props.theme.spinnerPrimary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
  transition: color 0.3s ease;
`;

// Define your theme colors
const lightTheme = {
  background: "rgba(255, 255, 255, 0.9)",
  text: "#333",
  spinnerPrimary: "#3498db",
  spinnerSecondary: "#f3f3f3",
};

const darkTheme = {
  background: "rgba(17, 24, 39, 0.9)",
  text: "#fff",
  spinnerPrimary: "#60a5fa",
  spinnerSecondary: "#374151",
};

const LoadingScreen = () => {
  const { darkMode } = useThemeStore();

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    </ThemeProvider>
  );
};

export default LoadingScreen;
