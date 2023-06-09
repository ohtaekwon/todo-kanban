import { css } from "@emotion/react";

const globalStyle = css`
  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
      Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo",
      "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", sans-serif;
  }
  h1,
  h2,
  h3,
  p {
    margin: 0;
    padding: 0;
  }
  button {
    border: none;
    background-color: transparent;
    padding: 0;
    cursor: pointer;
    outline: none;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ol {
    margin: 0;
  }
  input {
    background: none;
    border: none;
    color: inherit;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  address {
    font-style: normal;
  }
  * {
    box-sizing: border-box;
  }
  iframe {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 0;
  }
`;

export default globalStyle;
