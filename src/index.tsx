import React from "react";
import ReactDOM from "react-dom/client";
import { Global, ThemeProvider } from "@emotion/react";
import { globalStyle, theme } from "./styles";

import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
      <Global styles={globalStyle} />
    </ThemeProvider>
  </React.StrictMode>
);
