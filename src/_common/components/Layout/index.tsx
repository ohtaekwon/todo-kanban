import BackGround from "components/Background";
import React from "react";
import * as Styled from "./index.styles";
import { Props } from "./index.types";

export const Layout = React.forwardRef(function Layout(
  {
    as = "div",
    variant,
    backgroundColor = "inherit",
    backgroundImage = "inherit",

    background,
    children,
    ...rest
  }: React.PropsWithChildren<Props>,
  forwardedRef: React.Ref<HTMLElement>
) {
  return (
    <>
      <Styled.Layout
        className={`layout__${variant}`}
        as={as}
        variant={variant}
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage}
        ref={forwardedRef}
        {...rest}
      >
        {background && <BackGround />}
        {children}
      </Styled.Layout>
    </>
  );
});
