import { useEffect } from "react";
import useThemeStore from "../store/themeStore";

const ThemeProvider = ({ children }) => {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    // Apply the theme class to the root element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
};

export default ThemeProvider;
