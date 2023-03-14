import styled from "@emotion/styled";
import { ColumnProps } from "./index.types";

export const Wrapper = styled.div<Required<ColumnProps>>`
  width: 100%;
  padding: 16px;

  display: "flex";
  flex-direction: column;

  justify-content: "center";
  align-items: center;

  box-sizing: border-box;
  box-shadow: rgb(0 0 0 / 30%) 10px 10px 30px;
`;
