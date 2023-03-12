import styled from "@emotion/styled";
import { css } from "@emotion/react";

import { theme } from "styles";
import { LayoutProps } from "./index.types";

export const Layout = styled.main<Required<LayoutProps>>`
  margin: auto;
  background-color: ${({ theme, backgroundColor }) =>
    theme.colors[backgroundColor]};
  background: ${({ backgroundImage }) => backgroundImage};
  position: relative;
  z-index: 1;
  ${({ variant, backgroundColor }) => {
    switch (variant) {
      case "default": {
        return css`
          width: 100%;
          background-color: ${theme.colors.white};
        `;
      }
      case "sm": {
        return css`
          max-width: 670px;
          background-color: ${theme.colors.indigo_50};
        `;
      }
      case "md": {
        return css`
          max-width: 960px;
          background-color: ${theme.colors.indigo_300};
        `;
      }
      case "lg": {
        return css`
          max-width: 1280px;
          height: 100%;
          max-height: max-content;
          background-color: ${theme.colors.gray_50};
        `;
      }
      case "xl": {
        return css`
          max-width: 1600px;
        `;
      }
    }
  }}
`;
export const Aside = styled.aside<Required<any>>`
  width: 20%;
`;
