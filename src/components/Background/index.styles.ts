import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
export const Inner = styled.div`
  position: relative;
  display: flex;
`;

const KeyFrames = keyframes`
    0% {
      transform: translateY(100vh) scale(0);
    }
    100% {
      transform: translateY(-10vh) scale(1);
    }
  
`;

export const Item = styled.span<{ variant: number }>`
  position: relative;
  width: 50px;
  height: 50px;
  background: #4fc3dc;
  margin: 0 10px;
  border-radius: 50%;
  box-shadow: 0 0 0 10px #4fc3dc44, 0 0 50px #4fc3dc, 0 0 100px #4fc3dc;
  animation: ${KeyFrames} 15s linear infinite;
  animation-duration: ${({ variant }) => css`calc(125s / ${variant})`};
  :nth-of-type(even) {
    background: #ff2d75;
    box-shadow: 0 0 0 10px #ff2d7544, 0 0 50px #ff2d75, 0 0 100px #ff2d75;
  }
`;
